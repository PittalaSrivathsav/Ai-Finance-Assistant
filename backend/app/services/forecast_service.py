import numpy as np
from datetime import datetime, date
from collections import defaultdict
from sqlalchemy.orm import Session
from app.models.transaction import Transaction

def get_next_month_name(year: int, month: int) -> str:
    if month == 12:
        next_year = year + 1
        next_month = 1
    else:
        next_year = year
        next_month = month + 1
    dt = date(next_year, next_month, 1)
    return dt.strftime('%B %Y')

def calculate_spending_forecast(db: Session, user_id: int) -> dict:
    # 1. Fetch user's actual expense transactions
    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense'
    ).order_by(Transaction.date.asc()).all()

    # Determine reference next month label
    now = datetime.utcnow()
    current_year = now.year
    current_month = now.month
    next_month_str = get_next_month_name(current_year, current_month)

    if not transactions:
        return {
            "status": "insufficient_data",
            "forecast_amount": 0.0,
            "trend": "neutral",
            "percentage_change": 0.0,
            "confidence": "Low",
            "method": "N/A",
            "message": "Insufficient historical data to generate a forecast. Add expense transactions to enable AI spending predictions.",
            "historical_months_count": 0,
            "average_monthly_spend": 0.0,
            "next_month": next_month_str,
            "currency": "₹",
            "historical_data": []
        }

    # Group expenses by YYYY-MM
    monthly_totals = defaultdict(float)
    for t in transactions:
        if t.date:
            m_key = t.date.strftime('%Y-%m')
            monthly_totals[m_key] += float(t.amount)

    sorted_months = sorted(monthly_totals.keys())
    historical_data = [
        {"month": m, "total_spent": round(monthly_totals[m], 2)}
        for m in sorted_months
    ]

    total_expenses = sum(t.amount for t in transactions)
    n_months = len(sorted_months)

    # Use latest recorded month for next month calculation if historical
    latest_m_parts = sorted_months[-1].split('-')
    latest_year = int(latest_m_parts[0])
    latest_month = int(latest_m_parts[1])
    next_month_str = get_next_month_name(latest_year, latest_month)

    # CASE 1: Single month of data or few transactions
    if n_months == 1:
        single_month_total = monthly_totals[sorted_months[0]]
        # If multiple transactions exist within the month, compute run-rate / projection
        forecast_val = round(single_month_total, 2)
        return {
            "status": "success",
            "forecast_amount": forecast_val,
            "trend": "stable",
            "percentage_change": 0.0,
            "confidence": "Moderate",
            "method": "Monthly Spending Run-Rate",
            "message": f"Based on your recorded spending of ₹{single_month_total:,.2f}, your baseline projected spending for {next_month_str} is ₹{forecast_val:,.2f}.",
            "historical_months_count": 1,
            "average_monthly_spend": forecast_val,
            "next_month": next_month_str,
            "currency": "₹",
            "historical_data": historical_data
        }

    # CASE 2: Multi-month historical data (Linear Regression / Trend Analysis)
    x = np.arange(n_months, dtype=float)
    y = np.array([monthly_totals[m] for m in sorted_months], dtype=float)

    x_mean = np.mean(x)
    y_mean = np.mean(y)

    denom = np.sum((x - x_mean) ** 2)
    if denom != 0:
        slope = np.sum((x - x_mean) * (y - y_mean)) / denom
    else:
        slope = 0.0

    intercept = y_mean - slope * x_mean
    next_x = float(n_months)
    raw_forecast = slope * next_x + intercept
    forecast_val = round(max(0.0, raw_forecast), 2)

    last_month_spend = y[-1]
    if last_month_spend > 0:
        pct_change = round(((forecast_val - last_month_spend) / last_month_spend) * 100, 1)
    else:
        pct_change = 0.0

    if pct_change > 1.5:
        trend = "increasing"
        msg = f"Based on your spending trend over {n_months} months, spending is projected to increase by {pct_change}% to ₹{forecast_val:,.2f} in {next_month_str}."
    elif pct_change < -1.5:
        trend = "decreasing"
        msg = f"Based on your spending trend over {n_months} months, spending is projected to decrease by {abs(pct_change)}% to ₹{forecast_val:,.2f} in {next_month_str}."
    else:
        trend = "stable"
        msg = f"Based on your spending trend over {n_months} months, spending is projected to remain steady at ₹{forecast_val:,.2f} in {next_month_str}."

    confidence = "High" if n_months >= 3 else "Moderate"

    return {
        "status": "success",
        "forecast_amount": forecast_val,
        "trend": trend,
        "percentage_change": pct_change,
        "confidence": confidence,
        "method": "Linear Regression Trend Analysis",
        "message": msg,
        "historical_months_count": n_months,
        "average_monthly_spend": round(float(y_mean), 2),
        "next_month": next_month_str,
        "currency": "₹",
        "historical_data": historical_data
    }
