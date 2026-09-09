from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.transaction import (
    TransactionCreate, 
    TransactionUpdate, 
    TransactionResponse, 
    PaginatedTransactionsResponse
)
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("", response_model=PaginatedTransactionsResponse)
def get_transactions(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    type: Optional[str] = None,
    category: Optional[str] = None,
    month: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.user_id)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Transaction.description.ilike(search_pattern)) | 
            (Transaction.category.ilike(search_pattern))
        )
    
    if type and type.lower() != "all":
        query = query.filter(Transaction.type == type.lower())

    if category and category.lower() != "all":
        query = query.filter(Transaction.category.ilike(category))

    total = query.count()
    total_pages = (total + limit - 1) // limit if total > 0 else 1

    transactions = (
        query.order_by(Transaction.date.desc(), Transaction.transaction_id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "transactions": transactions,
        "total": total,
        "page": page,
        "total_pages": total_pages
    }

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    txn_in: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    txn = Transaction(
        user_id=current_user.user_id,
        date=txn_in.date,
        description=txn_in.description,
        amount=txn_in.amount,
        type=txn_in.type.lower(),
        category=txn_in.category
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    txn_in: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    txn = db.query(Transaction).filter(
        Transaction.transaction_id == transaction_id,
        Transaction.user_id == current_user.user_id
    ).first()

    if not txn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    update_data = txn_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(txn, field, value)

    db.commit()
    db.refresh(txn)
    return txn

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    txn = db.query(Transaction).filter(
        Transaction.transaction_id == transaction_id,
        Transaction.user_id == current_user.user_id
    ).first()

    if not txn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    db.delete(txn)
    db.commit()
    return {"message": "Transaction deleted successfully"}
