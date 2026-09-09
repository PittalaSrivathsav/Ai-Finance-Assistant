from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BudgetBase(BaseModel):
    month: str # 'YYYY-MM'
    category: str
    limit_amount: float

class BudgetCreate(BudgetBase):
    pass

class BudgetResponse(BudgetBase):
    budget_id: int
    user_id: int
    spent_amount: Optional[float] = 0.0
    percentage: Optional[int] = 0
    created_at: datetime

    class Config:
        from_attributes = True
