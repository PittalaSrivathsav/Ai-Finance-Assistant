from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.schemas.insight import InsightResponse
from app.services.auth_service import get_current_user
from app.services.insight_service import generate_insights_for_user

router = APIRouter(prefix="/insights", tags=["Insights"])

@router.get("", response_model=List[InsightResponse])
def get_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return generate_insights_for_user(db, current_user.user_id)
