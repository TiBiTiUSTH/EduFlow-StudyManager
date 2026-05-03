"""
Video Call Signaling API - WebRTC signaling server
Dùng WebSocket đã có trong main.py (video_offer, video_answer, ice_candidate, etc.)
File này chỉ chứa API phụ trợ
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.models import StudyRoomMember

router = APIRouter(prefix="/api/video", tags=["Video Call"])


@router.get("/check-permission/{room_id}/{user_id}")
async def check_permission(room_id: int, user_id: int, db: Session = Depends(get_db)):
    """Kiểm tra user có quyền gọi video trong room không"""
    member = db.query(StudyRoomMember).filter(
        StudyRoomMember.room_id == room_id,
        StudyRoomMember.user_id == user_id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Bạn chưa tham gia phòng này")
    return {"allowed": True, "role": member.role}
