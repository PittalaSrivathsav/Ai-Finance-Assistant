from app.routers.auth import router as auth_router
from app.routers.transactions import router as transactions_router
from app.routers.budgets import router as budgets_router
from app.routers.dashboard import router as dashboard_router
from app.routers.ml import router as ml_router
from app.routers.insights import router as insights_router
from app.routers.chatbot import router as chatbot_router
from app.routers.forecast import router as forecast_router

__all__ = [
    "auth_router",
    "transactions_router",
    "budgets_router",
    "dashboard_router",
    "ml_router",
    "insights_router",
    "chatbot_router",
    "forecast_router"
]
