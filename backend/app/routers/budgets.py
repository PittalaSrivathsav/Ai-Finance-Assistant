from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.budget import Budget
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate, BudgetResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/budgets", tags=["Budgets"])

@router.get("", response_model=List[BudgetResponse])
def get_budgets(
    month: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Budget).filter(Budget.user_id == current_user.user_id)
    if month:
        query = query.filter(Budget.month == month)
    
    budgets = query.all()

    # Calculate spent amounts dynamically
    results = []
    for b in budgets:
        spent = db.query(func.sum(Transaction.amount))\
            .filter(
                Transaction.user_id == current_user.user_id,
                Transaction.type == 'expense',
                Transaction.category.ilike(b.category)
            ).scalar() or 0.0

        pct = int(min(100, round((spent / b.limit_amount) * 100))) if b.limit_amount > 0 else 0

        results.append(BudgetResponse(
            budget_id=b.budget_id,
            user_id=b.user_id,
            month=b.month,
            category=b.category,
            limit_amount=b.limit_amount,
            spent_amount=spent,
            percentage=pct,
            created_at=b.created_at
        ))

    return results

@router.post("", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_or_update_budget(
    budget_in: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Budget).filter(
        Budget.user_id == current_user.user_id,
        Budget.month == budget_in.month,
        Budget.category == budget_in.category
    ).first()

    if existing:
        existing.limit_amount = budget_in.limit_amount
        db.commit()
        db.refresh(existing)
        return existing

    new_budget = Budget(
        user_id=current_user.user_id,
        month=budget_in.month,
        category=budget_in.category,
        limit_amount=budget_in.limit_amount
    )
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget
