from fastapi import APIRouter
from app.schemas.ml import PredictCategoryRequest, PredictCategoryResponse
from app.services.ml_service import ml_service

router = APIRouter(prefix="/ml", tags=["Machine Learning"])

@router.post("/predict-category", response_model=PredictCategoryResponse)
def predict_category(request: PredictCategoryRequest):
    result = ml_service.predict(request.description)
    return result
