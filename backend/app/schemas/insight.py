from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InsightResponse(BaseModel):
    insight_id: int
    user_id: int
    insight_type: str
    title: str
    insight_text: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatbotRequest(BaseModel):
    message: str

class ChatbotResponse(BaseModel):
    reply: str
    intent: Optional[str] = "general"
