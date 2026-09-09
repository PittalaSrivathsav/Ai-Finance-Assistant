from pydantic import BaseModel
from typing import List, Optional

class HistoricalMonthlySpend(BaseModel):
    month: str
    total_spent: float

class ForecastResponse(BaseModel):
    status: str
    forecast_amount: float
    trend: str
    percentage_change: float
    confidence: str
    method: str
    message: str
    historical_months_count: int
    average_monthly_spend: float
    next_month: str
    currency: str = "₹"
    historical_data: List[HistoricalMonthlySpend] = []
