from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, datetime
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, Transaction, Budget, Insight
from app.services.auth_service import get_password_hash
from app.routers import (
    auth_router,
    transactions_router,
    budgets_router,
    dashboard_router,
    ml_router,
    insights_router,
    chatbot_router,
    forecast_router
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API for AI Finance Assistant with NLP Machine Learning Categorization, Forecasting, and Budget Management."
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(transactions_router, prefix=settings.API_V1_STR)
app.include_router(budgets_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(ml_router, prefix=settings.API_V1_STR)
app.include_router(insights_router, prefix=settings.API_V1_STR)
app.include_router(chatbot_router, prefix=settings.API_V1_STR)
app.include_router(forecast_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def seed_initial_data():
    """Seeds default demo data if database is fresh."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "srivathsav@example.com").first()
        if not user:
            print("Seeding default demo user and financial data for 2026...")
            user = User(
                name="Srivathsav",
                email="srivathsav@example.com",
                password_hash=get_password_hash("password123")
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # Seed Transactions matching 2026 dates
            initial_txns = [
                {"date": date(2026, 9, 10), "description": "Swiggy dinner", "amount": 450, "type": "expense", "category": "Food"},
                {"date": date(2026, 9, 9), "description": "Salary", "amount": 35000, "type": "income", "category": "Income"},
                {"date": date(2026, 9, 8), "description": "Uber ride", "amount": 300, "type": "expense", "category": "Transport"},
                {"date": date(2026, 9, 7), "description": "Amazon headphones", "amount": 2000, "type": "expense", "category": "Shopping"},
                {"date": date(2026, 9, 5), "description": "Electricity Bill", "amount": 1200, "type": "expense", "category": "Bills"},
                {"date": date(2026, 9, 3), "description": "Freelance work", "amount": 5000, "type": "income", "category": "Income"},
                {"date": date(2026, 9, 2), "description": "Netflix subscription", "amount": 650, "type": "expense", "category": "Entertainment"},
                {"date": date(2026, 9, 1), "description": "Grocery supermarket", "amount": 2300, "type": "expense", "category": "Food"},
            ]
            for t in initial_txns:
                db.add(Transaction(user_id=user.user_id, **t))

            # Seed Budgets matching 2026-09
            initial_budgets = [
                {"category": "Food", "limit_amount": 5000, "month": "2026-09"},
                {"category": "Transport", "limit_amount": 3000, "month": "2026-09"},
                {"category": "Shopping", "limit_amount": 4000, "month": "2026-09"},
                {"category": "Bills", "limit_amount": 5000, "month": "2026-09"},
                {"category": "Entertainment", "limit_amount": 3000, "month": "2026-09"},
                {"category": "Others", "limit_amount": 2000, "month": "2026-09"},
            ]
            for b in initial_budgets:
                db.add(Budget(user_id=user.user_id, **b))

            db.commit()
            print("Default demo data for 2026 seeded successfully.")
    except Exception as e:
        print(f"Error during seeding: {e}")
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "message": "Welcome to AI Finance Assistant API",
        "docs": "/docs",
        "status": "healthy",
        "version": settings.VERSION
    }
