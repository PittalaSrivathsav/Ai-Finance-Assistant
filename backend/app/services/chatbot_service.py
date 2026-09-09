import re
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.transaction import Transaction
from app.models.budget import Budget
from app.services.forecast_service import calculate_spending_forecast

def process_chat_message(db: Session, user_id: int, user_message: str) -> dict:
    """
    Comprehensive financial intelligence chatbot engine.
    Handles balances, category spending, highest expenses, budgets,
    recent transactions, AI forecasts, and app guidance.
    """
    msg = (user_message or '').lower().strip()
    clean_msg = re.sub(r'[^a-zA-Z0-9\s]', ' ', msg)
    words = clean_msg.split()

    # Query core financial metrics
    total_income = db.query(func.sum(Transaction.amount))\
        .filter(Transaction.user_id == user_id, Transaction.type == 'income')\
        .scalar() or 0.0

    total_expenses = db.query(func.sum(Transaction.amount))\
        .filter(Transaction.user_id == user_id, Transaction.type == 'expense')\
        .scalar() or 0.0

    balance = total_income - total_expenses

    # 1. Greetings
    if msg in ["hi", "hello", "hey", "hola", "greetings", "good morning", "good afternoon", "good evening"] or (len(words) <= 2 and any(w in ["hi", "hello", "hey"] for w in words)):
        return {
            "reply": "Hello! I'm your AI Finance Assistant. You can ask me about your balance, specific category spending, top expenses, budgets, recent transactions, or your spending forecast!",
            "intent": "greeting"
        }

    # 2. Gratitude / Closing
    if any(w in msg for w in ["thank you", "thanks", "awesome", "perfect", "good job", "bye", "goodbye"]):
        return {
            "reply": "You're very welcome! Let me know if you need anything else to manage your finances.",
            "intent": "gratitude"
        }

    # 3. How-to Guides & App Guidance (Evaluated first to avoid triggering keyword overlap)
    if any(k in msg for k in ["how do i add", "add transaction", "add expense", "add income", "how to add", "how to record", "how to use", "how to edit", "how to delete"]):
        return {
            "reply": "To record a transaction: Go to the Transactions or Dashboard page, click on '+ Add Transaction', enter the amount, description, and date. You can choose Expense or Income, and our AI will automatically predict the category with a live confidence score!",
            "intent": "help_add_transaction"
        }

    if any(k in msg for k in ["how does ai", "categorization", "ai category", "ml", "nlp", "model", "how ai works"]):
        return {
            "reply": "Our AI model uses TF-IDF feature extraction and Machine Learning classification (trained on real transaction patterns) to predict categories (Food, Transport, Shopping, Bills, Pets, etc.) in real time as you type your transaction description.",
            "intent": "help_ai"
        }

    # 4. Forecast / Prediction Queries
    if any(k in msg for k in ["forecast", "predict", "next month", "future spending", "projection", "run rate"]):
        forecast = calculate_spending_forecast(db, user_id)
        if forecast.get("status") == "success":
            return {
                "reply": f"🔮 Spending Forecast: Based on your past spending ({forecast.get('method')}), your projected expense for {forecast.get('next_month')} is ₹{forecast.get('forecast_amount'):,.2f} ({forecast.get('percentage_change'):+}% trend vs last month, {forecast.get('confidence')} confidence).",
                "intent": "forecast_query"
            }
        else:
            return {
                "reply": "🔮 Spending Forecast: You don't have enough historical expense transactions yet to generate an accurate forecast. Add a few more expenses to enable AI trend projections!",
                "intent": "forecast_query"
            }

    # 5. Highest / Top Spending Category
    if any(k in msg for k in ["highest", "top spending", "most spent", "max expense", "biggest expense", "largest category", "where do i spend most"]):
        top_cat = db.query(
            Transaction.category,
            func.sum(Transaction.amount).label("total")
        ).filter(
            Transaction.user_id == user_id,
            Transaction.type == 'expense'
        ).group_by(Transaction.category).order_by(func.sum(Transaction.amount).desc()).first()

        if top_cat:
            cat_name, cat_amount = top_cat
            pct = round((cat_amount / total_expenses) * 100, 1) if total_expenses > 0 else 0
            return {
                "reply": f"📊 Your highest expenditure category is '{cat_name}' with ₹{cat_amount:,.2f} spent ({pct}% of your total expenses).",
                "intent": "top_spending_query"
            }
        else:
            return {
                "reply": "You haven't recorded any expenses yet to determine your top spending category.",
                "intent": "top_spending_query"
            }

    # 6. Specific Category Spending (e.g. "how much on food", "spent on pets", "shopping", "transport", "bills", etc.)
    known_categories = [
        "pet food", "pets", "pet", "food", "transport", "shopping", "bills", "entertainment",
        "health", "education", "others", "grocery", "groceries", "travel"
    ]
    matched_cat = None
    # Sort by length descending so multi-word terms like "pet food" match before "food"
    for cat in sorted(known_categories, key=len, reverse=True):
        if cat in msg:
            matched_cat = cat
            break

    if matched_cat and any(k in msg for k in ["spend", "spent", "spending", "how much", "cost", "expense", "total", "on"]):
        search_term = "Pets" if matched_cat in ["pets", "pet", "pet food"] else ("Food" if matched_cat in ["food", "grocery", "groceries"] else matched_cat.capitalize())
        cat_spent = db.query(func.sum(Transaction.amount))\
            .filter(
                Transaction.user_id == user_id,
                Transaction.type == 'expense',
                Transaction.category.ilike(f"%{search_term}%")
            ).scalar() or 0.0

        return {
            "reply": f"🛒 You have spent ₹{cat_spent:,.2f} on '{search_term}'.",
            "intent": "category_spending_query"
        }

    # 7. Combined Income & Expense Query
    if ("income" in msg and "expense" in msg) or ("income and expense" in msg) or ("both" in msg and "income" in msg):
        return {
            "reply": f"💰 Financial Overview:\n• Total Income: ₹{total_income:,.2f}\n• Total Expenses: ₹{total_expenses:,.2f}\n• Net Balance: ₹{balance:,.2f}",
            "intent": "income_and_expense_query"
        }

    # 8. Balance Query
    if "balance" in msg or "how much money" in msg or "current balance" in msg or "net balance" in msg:
        return {
            "reply": f"💳 Your current net balance is ₹{balance:,.2f} (Total Income: ₹{total_income:,.2f} - Total Expenses: ₹{total_expenses:,.2f}).",
            "intent": "balance_query"
        }

    # 9. Income Query
    if "income" in msg or "earned" in msg or "salary" in msg or "earnings" in msg:
        return {
            "reply": f"💵 Your total recorded income is ₹{total_income:,.2f}.",
            "intent": "income_query"
        }

    # 10. General Expenses Query
    if "expense" in msg or "spent" in msg or "spending" in msg or "expenditure" in msg:
        return {
            "reply": f"📉 Your total recorded expenses amount to ₹{total_expenses:,.2f}.",
            "intent": "expense_query"
        }

    # 11. Recent / Latest Transactions
    if any(k in msg for k in ["recent", "latest", "last transaction", "show transactions", "history", "recent expenses"]):
        recent_txns = db.query(Transaction).filter(
            Transaction.user_id == user_id
        ).order_by(Transaction.date.desc(), Transaction.transaction_id.desc()).limit(4).all()

        if recent_txns:
            lines = []
            for t in recent_txns:
                prefix = "+" if t.type == "income" else "-"
                lines.append(f"• {t.date.strftime('%b %d')}: {t.description} ({t.category}) — {prefix}₹{t.amount:,.2f}")
            return {
                "reply": "📋 Your recent transactions:\n" + "\n".join(lines),
                "intent": "recent_transactions_query"
            }
        else:
            return {
                "reply": "You have no recorded transactions yet. Click '+ Add Transaction' to start tracking!",
                "intent": "recent_transactions_query"
            }

    # 12. Budgets and Limits Query
    if "budget" in msg or "limit" in msg or "over budget" in msg:
        budgets = db.query(Budget).filter(Budget.user_id == user_id).all()
        if not budgets:
            return {
                "reply": "You don't have any budgets set up yet. Go to the Budgets page and click '+ Add Budget' to define category spending limits.",
                "intent": "budget_query"
            }

        status_lines = []
        near_limit_count = 0
        for b in budgets:
            spent = db.query(func.sum(Transaction.amount))\
                .filter(
                    Transaction.user_id == user_id,
                    Transaction.type == 'expense',
                    Transaction.category.ilike(b.category)
                ).scalar() or 0.0
            pct = round((spent / b.limit_amount) * 100) if b.limit_amount > 0 else 0
            if pct >= 80:
                near_limit_count += 1
                status_lines.append(f"⚠️ {b.category}: ₹{spent:,.0f} / ₹{b.limit_amount:,.0f} ({pct}%) - Near Limit")
            else:
                status_lines.append(f"✅ {b.category}: ₹{spent:,.0f} / ₹{b.limit_amount:,.0f} ({pct}%)")

        summary = f"You have {len(budgets)} active budget(s) ({near_limit_count} near or exceeding limit):\n" + "\n".join(status_lines)
        return {
            "reply": summary,
            "intent": "budget_query"
        }

    # 13. General Fallback with Contextual Guidance
    return {
        "reply": "I'm your AI Finance Assistant! Here are some things you can ask me:\n• 'What is my current balance?'\n• 'Show my total income and expenses'\n• 'How much did I spend on Food?'\n• 'Which category has the highest spending?'\n• 'What is my spending forecast for next month?'\n• 'How are my budgets doing?'\n• 'Show my recent transactions'",
        "intent": "general"
    }
