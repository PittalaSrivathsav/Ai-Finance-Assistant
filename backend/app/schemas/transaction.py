from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class TransactionBase(BaseModel):
    date: date
    description: str
    amount: float
    type: str # 'income' or 'expense'
    category: str

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    date: Optional[date] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    type: Optional[str] = None
    category: Optional[str] = None

class TransactionResponse(TransactionBase):
    transaction_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaginatedTransactionsResponse(BaseModel):
    transactions: List[TransactionResponse]
    total: int
    page: int
    total_pages: int
