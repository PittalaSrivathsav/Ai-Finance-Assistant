from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.insight import ChatbotRequest, ChatbotResponse
from app.services.auth_service import get_current_user
from app.services.chatbot_service import process_chat_message

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

@router.post("/query", response_model=ChatbotResponse)
def chat_query(
    request: ChatbotRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = process_chat_message(db, current_user.user_id, request.message)
    return result
