from pydantic import BaseModel
from typing import Optional

class PredictCategoryRequest(BaseModel):
    description: str
    amount: Optional[float] = None

class PredictCategoryResponse(BaseModel):
    predicted_category: str
    confidence: float
    is_income: bool = False
