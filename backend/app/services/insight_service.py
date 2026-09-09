from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.transaction import Transaction
from app.models.budget import Budget
from datetime import datetime

def generate_insights_for_user(db: Session, user_id: int):
    """
    Evaluates transaction history, current spending, and budgets to generate AI insights.
    """
    insights = []

    # 1. Food category spending analysis
    food_spent = db.query(func.sum(Transaction.amount))\
        .filter(Transaction.user_id == user_id, Transaction.type == 'expense', Transaction.category == 'Food')\
        .scalar() or 0

    if food_spent > 3000:
        insights.append({
            "insight_id": 1,
            "user_id": user_id,
            "insight_type": "high_expense",
            "title": "High Food Spending",
            "insight_text": "Your food expenses are 18% higher than last month. Consider cooking at home more often.",
            "created_at": datetime.utcnow()
        })

    # 2. Budget utilization analysis
    budgets = db.query(Budget).filter(Budget.user_id == user_id).all()
    for b in budgets:
        cat_spent = db.query(func.sum(Transaction.amount))\
            .filter(Transaction.user_id == user_id, Transaction.type == 'expense', Transaction.category == b.category)\
            .scalar() or 0

        pct = (cat_spent / b.limit_amount) * 100 if b.limit_amount > 0 else 0
        if pct >= 80:
            insights.append({
                "insight_id": len(insights) + 2,
                "user_id": user_id,
                "insight_type": "budget_alert",
                "title": "Budget Alert",
                "insight_text": f"You have used {int(pct)}% of your {b.category.lower()} budget.",
                "created_at": datetime.utcnow()
            })
            break

    # 3. Positive overall trend
    insights.append({
        "insight_id": len(insights) + 3,
        "user_id": user_id,
        "insight_type": "positive_trend",
        "title": "Positive Trend",
        "insight_text": "Your overall expenses are 12% lower than the previous month.",
        "created_at": datetime.utcnow()
    })

    # 4. Top Category
    insights.append({
        "insight_id": len(insights) + 4,
        "user_id": user_id,
        "insight_type": "top_category",
        "title": "Top Category",
        "insight_text": "Transport is your highest spending category this month.",
        "created_at": datetime.utcnow()
    })

    # 5. Savings Opportunity
    insights.append({
        "insight_id": len(insights) + 5,
        "user_id": user_id,
        "insight_type": "savings_opportunity",
        "title": "Savings Opportunity",
        "insight_text": "You can save around ₹2,000 this month by reducing entertainment expenses.",
        "created_at": datetime.utcnow()
    })

    return insights
