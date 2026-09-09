import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

def get_clean_database_url(url: str) -> str:
    """Sanitizes DATABASE_URL to handle postgres:// prefix and unescaped @ in passwords."""
    if not url or url.startswith("sqlite"):
        return url
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    
    if "://" in url:
        prefix, _, rest = url.partition("://")
        if "@" in rest:
            auth_part, host_part = rest.rsplit("@", 1)
            if ":" in auth_part:
                user, password = auth_part.split(":", 1)
                password = urllib.parse.quote_plus(urllib.parse.unquote(password))
                return f"{prefix}://{user}:{password}@{host_part}"
    return url

db_url = get_clean_database_url(settings.DATABASE_URL)

# SQLite connect_args
connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for obtaining database session in FastAPI endpoints."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

