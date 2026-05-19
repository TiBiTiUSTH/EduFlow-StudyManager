"""
Direct Message API - Chat riêng 1-1 giữa friends
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from ..database import get_db
from ..models.models import DirectMessage, FriendRelationship, User
from ..ai.ai_filter import is_toxic_message
import os

router = APIRouter(prefix="/api/dm", tags=["Direct Messages"])


class DMOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    sender_name: str
    sender_avatar: Optional[str] = None
    message: str
    message_type: str = "text"
    is_read: bool = False
    created_at: datetime

class ConversationOut(BaseModel):
    friend_id: int
    friend_name: str
    friend_avatar: Optional[str] = None
    last_message: Optional[str] = None
    last_time: Optional[datetime] = None
    unread_count: int = 0


@router.get("/conversations", response_model=List[ConversationOut])
async def get_conversations(user_id: int, db: Session = Depends(get_db)):
    """Lấy danh sách conversations (friends có tin nhắn)"""
    friends = db.query(FriendRelationship).filter(
        FriendRelationship.user_id == user_id
    ).all()

    result = []
    for rel in friends:
        friend = db.query(User).filter(User.id == rel.friend_id).first()
        if not friend:
            continue

        # Tin nhắn cuối
        last_msg = db.query(DirectMessage).filter(
            or_(
                and_(DirectMessage.sender_id == user_id, DirectMessage.receiver_id == rel.friend_id),
                and_(DirectMessage.sender_id == rel.friend_id, DirectMessage.receiver_id == user_id)
            )
        ).order_by(DirectMessage.created_at.desc()).first()

        # Số tin chưa đọc
        unread = db.query(DirectMessage).filter(
            DirectMessage.sender_id == rel.friend_id,
            DirectMessage.receiver_id == user_id,
            DirectMessage.is_read == False
        ).count()

        result.append(ConversationOut(
            friend_id=friend.id,
            friend_name=friend.full_name or friend.username,
            friend_avatar=friend.avatar_url,
            last_message=last_msg.message if last_msg else None,
            last_time=last_msg.created_at if last_msg else rel.created_at,
            unread_count=unread
        ))

    result.sort(key=lambda x: x.last_time or datetime.min, reverse=True)
    return result


@router.get("/{friend_id}/messages", response_model=List[DMOut])
async def get_messages(friend_id: int, user_id: int, limit: int = 50, db: Session = Depends(get_db)):
    """Lấy lịch sử chat 1-1 với friend"""
    messages = db.query(DirectMessage).filter(
        or_(
            and_(DirectMessage.sender_id == user_id, DirectMessage.receiver_id == friend_id),
            and_(DirectMessage.sender_id == friend_id, DirectMessage.receiver_id == user_id)
        )
    ).order_by(DirectMessage.created_at.desc()).limit(limit).all()

    # Đánh dấu đã đọc
    db.query(DirectMessage).filter(
        DirectMessage.sender_id == friend_id,
        DirectMessage.receiver_id == user_id,
        DirectMessage.is_read == False
    ).update({"is_read": True, "read_at": datetime.now()})
    db.commit()

    result = []
    for msg in reversed(messages):
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        result.append(DMOut(
            id=msg.id, sender_id=msg.sender_id, receiver_id=msg.receiver_id,
            sender_name=sender.full_name or sender.username if sender else "Unknown",
            sender_avatar=sender.avatar_url if sender else None,
            message=msg.message, message_type=msg.message_type,
            is_read=msg.is_read, created_at=msg.created_at
        ))
    return result


@router.post("/{friend_id}/send")
async def send_message(friend_id: int, user_id: int, message: str, db: Session = Depends(get_db)):
    """Gửi tin nhắn (HTTP fallback, thường dùng WebSocket)"""
    # Bộ lọc AI kiểm tra
    if is_toxic_message(message):
        raise HTTPException(
            status_code=400, 
            detail="Tin nhắn của bạn chứa ngôn từ không phù hợp."
        )

    msg = DirectMessage(
        sender_id=user_id, receiver_id=friend_id,
        message=message, message_type="text"
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {"id": msg.id, "message": "Đã gửi"}


@router.post("/{friend_id}/upload")
async def upload_file_dm(
    friend_id: int,
    user_id: int = Form(...),
    caption: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload file (ảnh, tài liệu) trong chat 1-1 với friend"""
    # Lưu file
    upload_dir = f"uploads/chat/dm_{min(user_id, friend_id)}_{max(user_id, friend_id)}"
    os.makedirs(upload_dir, exist_ok=True)
    
    timestamp = int(datetime.now().timestamp())
    safe_name = f"{timestamp}_{file.filename}"
    file_path = f"{upload_dir}/{safe_name}"
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    ext = file.filename.lower().rsplit('.', 1)[-1] if '.' in file.filename else ''
    if ext in ('png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'):
        msg_type = "image"
    else:
        msg_type = "file"
    
    file_url = f"/{upload_dir}/{safe_name}"
    message_text = file_url if not caption else f"{file_url}|||{caption}"
    
    msg = DirectMessage(
        sender_id=user_id, receiver_id=friend_id,
        message=message_text, message_type=msg_type
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    
    return {"id": msg.id, "file_url": file_url, "message_type": msg_type, "message": "Đã gửi file"}
