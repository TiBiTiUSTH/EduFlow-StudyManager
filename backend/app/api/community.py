"""
Subject Community API - Kênh chat theo môn học (Công khai & Riêng tư)
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
from ..database import get_db
from ..models.models import SubjectChannel, SubjectChannelMember, SubjectChannelMessage, ChannelJoinRequest, User, Notification
from ..ai.ai_filter import is_toxic_message
from .websocket import manager

router = APIRouter(prefix="/api/community", tags=["Community"])


class ChannelOut(BaseModel):
    id: int
    subject_name: str
    grade_level: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    is_private: bool = False
    member_count: int = 0
    is_joined: bool = False
    creator_id: Optional[int] = None
    pending_request: bool = False  

class MessageOut(BaseModel):
    id: int
    user_id: int
    username: str
    avatar_url: Optional[str] = None
    message: str
    message_type: str = "text"
    created_at: datetime

class MemberOut(BaseModel):
    user_id: int
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    joined_at: datetime

class JoinRequestOut(BaseModel):
    id: int
    user_id: int
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    status: str
    created_at: datetime


class CreateChannelRequest(BaseModel):
    subject_name: str
    description: Optional[str] = None
    is_private: bool = False

@router.post("/channels/create", response_model=ChannelOut)
async def create_channel(req: CreateChannelRequest, user_id: int, db: Session = Depends(get_db)):
    """Tạo channel mới (Công khai hoặc Riêng tư)"""
    ch = SubjectChannel(
        subject_name=req.subject_name,
        description=req.description,
        icon=None,
        creator_id=user_id,
        is_private=req.is_private,
        is_active=True,
        member_count=1
    )
    db.add(ch)
    db.commit()
    db.refresh(ch)
    
    # Tự động tham gia 
    member = SubjectChannelMember(channel_id=ch.id, user_id=user_id)
    db.add(member)
    db.commit()
    
    return ChannelOut(
        id=ch.id, subject_name=ch.subject_name, grade_level=ch.grade_level,
        description=ch.description, icon=ch.icon, is_private=ch.is_private,
        member_count=ch.member_count, is_joined=True, creator_id=ch.creator_id
    )

@router.get("/channels", response_model=List[ChannelOut])
async def get_channels(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Lấy danh sách tất cả channels"""

    channels = db.query(SubjectChannel).filter(SubjectChannel.is_active == True).all()
    result = []
    for ch in channels:
        is_joined = False
        pending_request = False
        if user_id:
            member = db.query(SubjectChannelMember).filter(
                SubjectChannelMember.channel_id == ch.id,
                SubjectChannelMember.user_id == user_id
            ).first()
            is_joined = member is not None
            # Kiểm tra đã gửi yêu cầu
            if not is_joined and ch.is_private:
                req = db.query(ChannelJoinRequest).filter(
                    ChannelJoinRequest.channel_id == ch.id,
                    ChannelJoinRequest.user_id == user_id,
                    ChannelJoinRequest.status == "pending"
                ).first()
                pending_request = req is not None
        result.append(ChannelOut(
            id=ch.id, subject_name=ch.subject_name, grade_level=ch.grade_level,
            description=ch.description, icon=ch.icon, is_private=ch.is_private,
            member_count=ch.member_count, is_joined=is_joined,
            creator_id=ch.creator_id, pending_request=pending_request
        ))
    return result


@router.post("/channels/{channel_id}/join")
async def join_channel(channel_id: int, user_id: int, db: Session = Depends(get_db)):
    """Tham gia channel (public) hoặc Gửi yêu cầu (private)"""
    channel = db.query(SubjectChannel).filter(SubjectChannel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel không tồn tại")

    existing = db.query(SubjectChannelMember).filter(
        SubjectChannelMember.channel_id == channel_id,
        SubjectChannelMember.user_id == user_id
    ).first()
    if existing:
        return {"message": "Đã tham gia channel này rồi"}

    # RIÊNG TƯ: Gửi yêu cầu 
    if channel.is_private:
        # Check gửi yêu cầu
        existing_req = db.query(ChannelJoinRequest).filter(
            ChannelJoinRequest.channel_id == channel_id,
            ChannelJoinRequest.user_id == user_id,
            ChannelJoinRequest.status == "pending"
        ).first()
        if existing_req:
            raise HTTPException(status_code=400, detail="Bạn đã gửi yêu cầu rồi, vui lòng chờ duyệt.")

        # Tạo yêu cầu
        join_req = ChannelJoinRequest(channel_id=channel_id, user_id=user_id, status="pending")
        db.add(join_req)

        # Gửi thông báo đến Chủ nhóm
        requester = db.query(User).filter(User.id == user_id).first()
        requester_name = requester.full_name or requester.username if requester else "Ai đó"
        notif = Notification(
            user_id=channel.creator_id,
            sender_id=user_id,
            notification_type="join_request",
            title="Yêu cầu tham gia nhóm",
            message=f"{requester_name} muốn tham gia nhóm \"{channel.subject_name}\"",
            link_url="/stms/student/community/group",
            priority="high",
            is_read=False
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)

        # Thông báo 
        if manager.is_online(channel.creator_id):
            await manager.send_personal(channel.creator_id, {
                "type": "new_notification",
                "event": "new_notification",
                "data": {
                    "id": notif.id,
                    "title": notif.title,
                    "message": notif.message,
                    "notification_type": "join_request",
                    "link_url": notif.link_url,
                    "is_read": False,
                    "created_at": str(notif.created_at)
                }
            })

        return {"message": "Đã gửi yêu cầu tham gia nhóm. Vui lòng chờ chủ nhóm duyệt."}

    # NHÓM CÔNG KHAI: Join thẳng 
    member = SubjectChannelMember(channel_id=channel_id, user_id=user_id)
    db.add(member)
    channel.member_count = (channel.member_count or 0) + 1
    db.commit()
    return {"message": f"Đã tham gia {channel.subject_name}"}


@router.post("/channels/{channel_id}/leave")
async def leave_channel(channel_id: int, user_id: int, db: Session = Depends(get_db)):
    """Rời channel"""
    member = db.query(SubjectChannelMember).filter(
        SubjectChannelMember.channel_id == channel_id,
        SubjectChannelMember.user_id == user_id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Chưa tham gia channel này")

    db.delete(member)
    channel = db.query(SubjectChannel).filter(SubjectChannel.id == channel_id).first()
    if channel:
        channel.member_count = max(0, (channel.member_count or 1) - 1)
    db.commit()
    return {"message": "Đã rời channel"}


# QUẢN LÝ YÊU CẦU (Nhóm riêng tư)

@router.get("/channels/{channel_id}/join-requests", response_model=List[JoinRequestOut])
async def get_join_requests(channel_id: int, user_id: int, db: Session = Depends(get_db)):
    """Lấy danh sách yêu cầu tham gia (chỉ dành cho Chủ nhóm)"""
    channel = db.query(SubjectChannel).filter(SubjectChannel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel không tồn tại")
    if channel.creator_id != user_id:
        raise HTTPException(status_code=403, detail="Chỉ chủ nhóm mới xem được yêu cầu")

    requests = db.query(ChannelJoinRequest).filter(
        ChannelJoinRequest.channel_id == channel_id,
        ChannelJoinRequest.status == "pending"
    ).order_by(ChannelJoinRequest.created_at.desc()).all()

    result = []
    for r in requests:
        user = db.query(User).filter(User.id == r.user_id).first()
        result.append(JoinRequestOut(
            id=r.id, user_id=r.user_id,
            username=user.username if user else "Unknown",
            full_name=user.full_name if user else None,
            avatar_url=user.avatar_url if user else None,
            status=r.status, created_at=r.created_at
        ))
    return result


@router.put("/channels/{channel_id}/join-requests/{request_id}/accept")
async def accept_join_request(channel_id: int, request_id: int, user_id: int, db: Session = Depends(get_db)):
    """Chấp nhận yêu cầu tham gia nhóm"""
    channel = db.query(SubjectChannel).filter(SubjectChannel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel không tồn tại")
    if channel.creator_id != user_id:
        raise HTTPException(status_code=403, detail="Chỉ chủ nhóm mới duyệt được yêu cầu")

    join_req = db.query(ChannelJoinRequest).filter(
        ChannelJoinRequest.id == request_id,
        ChannelJoinRequest.channel_id == channel_id,
        ChannelJoinRequest.status == "pending"
    ).first()
    if not join_req:
        raise HTTPException(status_code=404, detail="Yêu cầu không tồn tại hoặc đã được xử lý")

    # Chấp nhận
    join_req.status = "accepted"

    # Thêm vào nhóm
    member = SubjectChannelMember(channel_id=channel_id, user_id=join_req.user_id)
    db.add(member)
    channel.member_count = (channel.member_count or 0) + 1

    # Gửi thông báo
    notif = Notification(
        user_id=join_req.user_id,
        sender_id=user_id,
        notification_type="community",
        title="Yêu cầu được chấp nhận",
        message=f"Bạn đã được chấp nhận vào nhóm \"{channel.subject_name}\"",
        link_url="/stms/student/community/group",
        priority="medium",
        is_read=False
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)

    # Thông báo real-time cho người yêu cầu
    if manager.is_online(join_req.user_id):
        await manager.send_personal(join_req.user_id, {
            "type": "new_notification",
            "event": "new_notification",
            "data": {
                "id": notif.id,
                "title": notif.title,
                "message": notif.message,
                "notification_type": "community",
                "link_url": notif.link_url,
                "is_read": False,
                "created_at": str(notif.created_at)
            }
        })

    return {"message": "Đã chấp nhận yêu cầu tham gia"}


@router.put("/channels/{channel_id}/join-requests/{request_id}/reject")
async def reject_join_request(channel_id: int, request_id: int, user_id: int, db: Session = Depends(get_db)):
    """Từ chối yêu cầu tham gia nhóm"""
    channel = db.query(SubjectChannel).filter(SubjectChannel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel không tồn tại")
    if channel.creator_id != user_id:
        raise HTTPException(status_code=403, detail="Chỉ chủ nhóm mới duyệt được yêu cầu")

    join_req = db.query(ChannelJoinRequest).filter(
        ChannelJoinRequest.id == request_id,
        ChannelJoinRequest.channel_id == channel_id,
        ChannelJoinRequest.status == "pending"
    ).first()
    if not join_req:
        raise HTTPException(status_code=404, detail="Yêu cầu không tồn tại hoặc đã được xử lý")

    join_req.status = "rejected"

    # Gửi thông báo
    notif = Notification(
        user_id=join_req.user_id,
        sender_id=user_id,
        notification_type="community",
        title="Yêu cầu bị từ chối",
        message=f"Yêu cầu tham gia nhóm \"{channel.subject_name}\" đã bị từ chối.",
        link_url="/stms/student/community/group",
        priority="medium",
        is_read=False
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)

    # Thông báo
    if manager.is_online(join_req.user_id):
        await manager.send_personal(join_req.user_id, {
            "type": "new_notification",
            "event": "new_notification",
            "data": {
                "id": notif.id,
                "title": notif.title,
                "message": notif.message,
                "notification_type": "community",
                "link_url": notif.link_url,
                "is_read": False,
                "created_at": str(notif.created_at)
            }
        })

    return {"message": "Đã từ chối yêu cầu tham gia"}


@router.get("/channels/{channel_id}/messages", response_model=List[MessageOut])
async def get_channel_messages(channel_id: int, limit: int = 50, db: Session = Depends(get_db)):
    """Lấy lịch sử tin nhắn channel"""
    messages = db.query(SubjectChannelMessage).filter(
        SubjectChannelMessage.channel_id == channel_id
    ).order_by(SubjectChannelMessage.created_at.desc()).limit(limit).all()

    result = []
    for msg in reversed(messages):
        user = db.query(User).filter(User.id == msg.user_id).first()
        result.append(MessageOut(
            id=msg.id, user_id=msg.user_id,
            username=user.username if user else "Unknown",
            avatar_url=user.avatar_url if user else None,
            message=msg.message, message_type=msg.message_type,
            created_at=msg.created_at
        ))
    return result


@router.post("/channels/{channel_id}/messages")
async def send_channel_message(channel_id: int, user_id: int, message: str, db: Session = Depends(get_db)):
    """Gửi tin nhắn vào channel (HTTP fallback, thường dùng WebSocket)"""
    # Kiểm tra bộ lọc AI
    if is_toxic_message(message):
        raise HTTPException(
            status_code=400, 
            detail="Tin nhắn của bạn chứa ngôn từ không phù hợp."
        )

    msg = SubjectChannelMessage(
        channel_id=channel_id, user_id=user_id,
        message=message, message_type="text"
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {"id": msg.id, "message": "Đã gửi"}


@router.get("/channels/{channel_id}/members", response_model=List[MemberOut])
async def get_channel_members(channel_id: int, db: Session = Depends(get_db)):
    """Lấy danh sách members trong channel, loại trừ Admin vì Admin chỉ quản lý hệ thống"""
    members = db.query(SubjectChannelMember).filter(
        SubjectChannelMember.channel_id == channel_id
    ).all()

    result = []
    for m in members:
        user = db.query(User).filter(User.id == m.user_id).first()
        is_admin = False
        if user and user.roles:
            is_admin = any(ur.role.role_name == "admin" for ur in user.roles)
            
        if user and not is_admin:
            result.append(MemberOut(
                user_id=user.id, username=user.username,
                full_name=user.full_name, avatar_url=user.avatar_url,
                joined_at=m.joined_at
            ))
    return result


@router.delete("/channels/{channel_id}")
async def delete_channel(channel_id: int, user_id: int, db: Session = Depends(get_db)):
    """Xóa nhóm hoàn toàn - Dành cho Creator"""
    channel = db.query(SubjectChannel).filter(SubjectChannel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel không tồn tại")
    
    if channel.creator_id != user_id:
        raise HTTPException(status_code=403, detail="Chỉ người tạo nhóm (Chủ nhóm) mới có quyền xóa Nhóm")
    
    db.query(Notification).filter(
        Notification.title.contains(channel.subject_name),
        Notification.notification_type.in_(["join_request", "community", "community_message"])
    ).delete(synchronize_session=False)
    db.delete(channel)
    db.commit()
    return {"message": "Nhóm đã được giải tán thành công"}


@router.delete("/channels/{channel_id}/members/{member_id}")
async def kick_channel_member(channel_id: int, member_id: int, user_id: int, db: Session = Depends(get_db)):
    """Kích một thành viên ra khỏi nhóm - Dành cho Creator"""
    channel = db.query(SubjectChannel).filter(SubjectChannel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel không tồn tại")
    
    if channel.creator_id != user_id:
        raise HTTPException(status_code=403, detail="Chỉ người tạo nhóm mới có quyền kích thành viên")

    if member_id == user_id:
        raise HTTPException(status_code=400, detail="Bạn không thể tự kích chính mình. Hãy dùng chức năng Rời Nhóm.")

    member = db.query(SubjectChannelMember).filter(
        SubjectChannelMember.channel_id == channel_id,
        SubjectChannelMember.user_id == member_id
    ).first()
    
    if not member:
        raise HTTPException(status_code=404, detail="Người dùng này không còn trong nhóm")

    db.delete(member)
    channel.member_count = max(0, (channel.member_count or 1) - 1)
    db.commit()
    return {"message": "Thành viên đã bị mời ra khỏi nhóm"}


@router.delete("/channels/{channel_id}/messages/{message_id}")
async def delete_channel_message(channel_id: int, message_id: int, user_id: int, db: Session = Depends(get_db)):
    """Xóa / Thu hồi tin nhắn - Dành cho người gửi hoặc Creator"""
    msg = db.query(SubjectChannelMessage).filter(SubjectChannelMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Tin nhắn không tồn tại")
    
    channel = db.query(SubjectChannel).filter(SubjectChannel.id == channel_id).first()
    
    if msg.user_id != user_id:
        raise HTTPException(status_code=403, detail="Bạn không có quyền thu hồi tin nhắn của người khác")
        
    msg.message = "Tin nhắn đã bị thu hồi"
    msg.message_type = "recalled"
    db.commit()
    return {"message": "Tin nhắn đã được thu hồi"}
