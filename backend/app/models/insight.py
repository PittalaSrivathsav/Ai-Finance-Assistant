from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Insight(Base):
    __tablename__ = "insights"

    insight_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    insight_type = Column(String(50), nullable=False) # 'high_expense', 'budget_alert', 'positive_trend', 'top_category', 'savings_opportunity'
    title = Column(String(100), nullable=False)
    insight_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="insights")
