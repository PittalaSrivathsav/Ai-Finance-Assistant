from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.forecast import ForecastResponse
from app.services.auth_service import get_current_user
from app.services.forecast_service import calculate_spending_forecast

router = APIRouter(prefix="/forecast", tags=["Forecasting"])

@router.get("", response_model=ForecastResponse)
@router.get("/", response_model=ForecastResponse)
def get_spending_forecast(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = calculate_spending_forecast(db, current_user.user_id)
    return result
