from pydantic import BaseModel
from typing import List, Dict, Any

class CategoryBreakdownItem(BaseModel):
    name: str
    value: float
    percentage: float
    color: str

class MonthlyTrendItem(BaseModel):
    month: str
    Income: float
    Expenses: float

class DashboardSummaryResponse(BaseModel):
    total_income: float
    total_expenses: float
    balance: float
    active_budgets_count: int
    budgets_near_limit_count: int
    category_breakdown: List[CategoryBreakdownItem]
    monthly_trend: List[MonthlyTrendItem]
    latest_insight: Dict[str, Any]
