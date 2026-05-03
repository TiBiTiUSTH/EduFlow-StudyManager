"""
Chat API - Tin nhắn trong Study Room
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from ..database import get_db
from ..models.models import StudyRoomMessage, StudyRoomMember, User

router = APIRouter(prefix="/api/chat", tags=["Chat"])


class ChatMessageOut(BaseModel):
    id: int
    room_id: int
    user_id: int
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    message: str
    message_type: str = "text"
    created_at: datetime


@router.get("/room/{room_id}/messages", response_model=List[ChatMessageOut])
async def get_room_messages(room_id: int, limit: int = 50, db: Session = Depends(get_db)):
    """Lấy lịch sử chat phòng"""
    messages = db.query(StudyRoomMessage).filter(
        StudyRoomMessage.room_id == room_id
    ).order_by(StudyRoomMessage.created_at.desc()).limit(limit).all()

    result = []
    for msg in reversed(messages):
        user = db.query(User).filter(User.id == msg.user_id).first()
        result.append(ChatMessageOut(
            id=msg.id, room_id=msg.room_id, user_id=msg.user_id,
            username=user.username if user else "Unknown",
            full_name=user.full_name if user else None,
            avatar_url=user.avatar_url if user else None,
            message=msg.message, message_type=msg.message_type,
            created_at=msg.created_at
        ))
    return result


@router.post("/room/{room_id}/send")
async def send_room_message(room_id: int, user_id: int, message: str, db: Session = Depends(get_db)):
    """Gửi tin nhắn vào phòng (HTTP fallback)"""
    # Kiểm tra quyền
    member = db.query(StudyRoomMember).filter(
        StudyRoomMember.room_id == room_id,
        StudyRoomMember.user_id == user_id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Bạn chưa tham gia phòng này")

    msg = StudyRoomMessage(
        room_id=room_id, user_id=user_id,
        message=message, message_type="text"
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {"id": msg.id, "message": "Đã gửi"}
