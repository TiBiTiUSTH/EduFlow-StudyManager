"""
Buddy System API - Kết bạn học
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from ..database import get_db
from ..models.models import BuddyRequest, BuddyRelationship, User, UserProfile, Notification
from .websocket import manager

router = APIRouter(prefix="/api/buddies", tags=["Buddies"])


class BuddyOut(BaseModel):
    user_id: int
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    school_name: Optional[str] = None
    grade_level: Optional[str] = None
    is_online: bool = False
    since: datetime

class RequestOut(BaseModel):
    id: int
    sender_id: int
    sender_name: str
    sender_avatar: Optional[str] = None
    message: Optional[str] = None
    status: str
    created_at: datetime

class BrowseUserOut(BaseModel):
    user_id: int
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    school_name: Optional[str] = None
    grade_level: Optional[str] = None
    study_goal: Optional[str] = None
    is_buddy: bool = False
    request_sent: bool = False


@router.post("/request/{target_user_id}")
async def send_buddy_request(target_user_id: int, sender_id: int, message: str = "", db: Session = Depends(get_db)):
    """Gửi lời mời kết bạn"""
    if sender_id == target_user_id:
        raise HTTPException(status_code=400, detail="Không thể kết bạn với chính mình")

    # Kiểm tra quan hệ
    existing = db.query(BuddyRelationship).filter(
        or_(
            and_(BuddyRelationship.user_id == sender_id, BuddyRelationship.buddy_id == target_user_id),
            and_(BuddyRelationship.user_id == target_user_id, BuddyRelationship.buddy_id == sender_id)
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Đã là bạn học rồi")

    # Kiểm tra lời mời
    pending = db.query(BuddyRequest).filter(
        BuddyRequest.sender_id == sender_id,
        BuddyRequest.receiver_id == target_user_id,
        BuddyRequest.status == "pending"
    ).first()
    if pending:
        raise HTTPException(status_code=400, detail="Đã gửi lời mời rồi")

    request = BuddyRequest(
        sender_id=sender_id, receiver_id=target_user_id,
        message=message or "Chào bạn! Mình muốn kết bạn học cùng nhau.",
        status="pending"
    )
    db.add(request)

    # Tạo thông báo
    sender = db.query(User).filter(User.id == sender_id).first()
    notif = Notification(
        user_id=target_user_id, sender_id=sender_id,
        notification_type="buddy_request",
        title="Lời mời kết bạn",
        message=f"{sender.full_name or sender.username} muốn kết bạn học với bạn",
        link_url="/stms/student/community/friends"
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)

    # Đẩy thông báo
    if manager.is_online(target_user_id):
        await manager.send_personal(target_user_id, {
            "type": "new_notification",
            "event": "new_notification",
            "data": {
                "id": notif.id,
                "title": notif.title,
                "message": notif.message,
                "notification_type": "buddy_request",
                "link_url": notif.link_url,
                "is_read": False,
                "created_at": str(notif.created_at)
            }
        })

    return {"message": "Đã gửi lời mời kết bạn"}


@router.put("/request/{request_id}/accept")
async def accept_buddy_request(request_id: int, db: Session = Depends(get_db)):
    """Chấp nhận lời mời"""
    request = db.query(BuddyRequest).filter(BuddyRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Lời mời không tồn tại")
    if request.status != "pending":
        raise HTTPException(status_code=400, detail="Lời mời đã được xử lý")

    request.status = "accepted"
    request.responded_at = datetime.now()

    # Tạo quan hệ nếu chưa có
    existing_rel = db.query(BuddyRelationship).filter(
        BuddyRelationship.user_id == request.sender_id, 
        BuddyRelationship.buddy_id == request.receiver_id
    ).first()
    
    if not existing_rel:
        rel1 = BuddyRelationship(user_id=request.sender_id, buddy_id=request.receiver_id)
        rel2 = BuddyRelationship(user_id=request.receiver_id, buddy_id=request.sender_id)
        db.add(rel1)
        db.add(rel2)

    # Thông báo người gửi
    receiver = db.query(User).filter(User.id == request.receiver_id).first()
    notif = Notification(
        user_id=request.sender_id, sender_id=request.receiver_id,
        notification_type="buddy_accepted",
        title="Kết bạn thành công!",
        message=f"{receiver.full_name or receiver.username} đã chấp nhận lời mời kết bạn",
        link_url="/stms/student/community/friends"
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)

    # Đẩy thông báo 
    if manager.is_online(request.sender_id):
        await manager.send_personal(request.sender_id, {
            "type": "new_notification",
            "event": "new_notification",
            "data": {
                "id": notif.id,
                "title": notif.title,
                "message": notif.message,
                "notification_type": "buddy_accepted",
                "link_url": notif.link_url,
                "is_read": False,
                "created_at": str(notif.created_at)
            }
        })

    return {"message": "Đã chấp nhận kết bạn"}


@router.put("/request/{request_id}/reject")
async def reject_buddy_request(request_id: int, db: Session = Depends(get_db)):
    """Từ chối lời mời"""
    request = db.query(BuddyRequest).filter(BuddyRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Lời mời không tồn tại")
    request.status = "rejected"
    request.responded_at = datetime.now()
    db.commit()
    return {"message": "Đã từ chối lời mời"}


@router.get("/my-buddies", response_model=List[BuddyOut])
async def get_my_buddies(user_id: int, db: Session = Depends(get_db)):
    """Danh sách bạn học của tôi"""
    relationships = db.query(BuddyRelationship).filter(
        BuddyRelationship.user_id == user_id
    ).all()

    result = []
    for rel in relationships:
        buddy = db.query(User).filter(User.id == rel.buddy_id).first()
        if buddy:
            profile = db.query(UserProfile).filter(UserProfile.user_id == buddy.id).first()
            result.append(BuddyOut(
                user_id=buddy.id, username=buddy.username,
                full_name=buddy.full_name, avatar_url=buddy.avatar_url,
                school_name=profile.school_name if profile else None,
                grade_level=profile.grade_level if profile else None,
                since=rel.created_at
            ))
    return result


@router.get("/requests", response_model=List[RequestOut])
async def get_pending_requests(user_id: int, db: Session = Depends(get_db)):
    """Lời mời kết bạn đang chờ"""
    requests = db.query(BuddyRequest).filter(
        BuddyRequest.receiver_id == user_id,
        BuddyRequest.status == "pending"
    ).order_by(BuddyRequest.created_at.desc()).all()

    result = []
    for req in requests:
        sender = db.query(User).filter(User.id == req.sender_id).first()
        result.append(RequestOut(
            id=req.id, sender_id=req.sender_id,
            sender_name=sender.full_name or sender.username if sender else "Unknown",
            sender_avatar=sender.avatar_url if sender else None,
            message=req.message, status=req.status, created_at=req.created_at
        ))
    return result


@router.delete("/{buddy_id}")
async def remove_buddy(buddy_id: int, user_id: int, db: Session = Depends(get_db)):
    """Hủy kết bạn - xóa sạch toàn bộ: quan hệ, tin nhắn, lời mời, thông báo"""
    from ..models.models import DirectMessage, Notification

    # 1. Xóa toàn bộ tin nhắn
    db.query(DirectMessage).filter(
        or_(
            and_(DirectMessage.sender_id == user_id, DirectMessage.receiver_id == buddy_id),
            and_(DirectMessage.sender_id == buddy_id, DirectMessage.receiver_id == user_id)
        )
    ).delete(synchronize_session=False)

    # 2. Xóa toàn bộ lời mời kết bạn 
    db.query(BuddyRequest).filter(
        or_(
            and_(BuddyRequest.sender_id == user_id, BuddyRequest.receiver_id == buddy_id),
            and_(BuddyRequest.sender_id == buddy_id, BuddyRequest.receiver_id == user_id)
        )
    ).delete(synchronize_session=False)

    # 3. Xóa thông báo kết bạn
    db.query(Notification).filter(
        or_(
            and_(Notification.user_id == user_id, Notification.sender_id == buddy_id,
                 Notification.notification_type.in_(["buddy_request", "buddy_accepted", "direct_message"])),
            and_(Notification.user_id == buddy_id, Notification.sender_id == user_id,
                 Notification.notification_type.in_(["buddy_request", "buddy_accepted", "direct_message"]))
        )
    ).delete(synchronize_session=False)

    # 4. Xóa bạn bè
    db.query(BuddyRelationship).filter(
        or_(
            and_(BuddyRelationship.user_id == user_id, BuddyRelationship.buddy_id == buddy_id),
            and_(BuddyRelationship.user_id == buddy_id, BuddyRelationship.buddy_id == user_id)
        )
    ).delete(synchronize_session=False)

    db.commit()
    return {"message": "Đã hủy kết bạn và xóa toàn bộ dữ liệu liên quan"}


@router.get("/browse", response_model=List[BrowseUserOut])
async def browse_users(user_id: int, subject: Optional[str] = None, grade: Optional[str] = None, limit: int = 20, db: Session = Depends(get_db)):
    """Browse sinh viên cùng môn (KHÔNG phải matching/swipe)"""
    from ..models.models import UserRole
    query = db.query(User).filter(
        User.id != user_id, 
        User.is_active == True,
        ~User.roles.any(UserRole.role.has(role_name="admin"))
    )

    users = query.limit(limit).all()
    
    # Danh sách bạn
    buddy_ids = set()
    rels = db.query(BuddyRelationship).filter(BuddyRelationship.user_id == user_id).all()
    for r in rels:
        buddy_ids.add(r.buddy_id)

    # Danh sách pending
    pending_ids = set()
    pending = db.query(BuddyRequest).filter(
        BuddyRequest.sender_id == user_id, BuddyRequest.status == "pending"
    ).all()
    for p in pending:
        pending_ids.add(p.receiver_id)

    result = []
    for u in users:
        profile = db.query(UserProfile).filter(UserProfile.user_id == u.id).first()
        result.append(BrowseUserOut(
            user_id=u.id, username=u.username,
            full_name=u.full_name, avatar_url=u.avatar_url,
            school_name=profile.school_name if profile else None,
            grade_level=profile.grade_level if profile else None,
            study_goal=profile.study_goal if profile else None,
            is_buddy=u.id in buddy_ids,
            request_sent=u.id in pending_ids
        ))
    return result
