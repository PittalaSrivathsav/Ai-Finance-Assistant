import os
from dotenv import load_dotenv

# Load .env file for local development
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

class Settings:
    PROJECT_NAME: str = "AI Finance Assistant API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database: reads from DATABASE_URL env var (set in .env locally, or Render env vars in production)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'finance.db'))}"
    )
    
    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ai-finance-assistant-secret-key-2026-secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # ML Models path
    ML_MODELS_DIR: str = os.path.abspath(
        os.path.join(os.path.dirname(__file__), '..', 'ml_pipeline', 'saved_models')
    )

    # Google OAuth
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")

settings = Settings()

