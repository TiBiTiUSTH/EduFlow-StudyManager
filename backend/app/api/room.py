"""
Study Room API - Phòng học nhóm với Room Code
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import random
import string
from ..database import get_db
from ..models.models import StudyRoom, StudyRoomMember, User

router = APIRouter(prefix="/api/room", tags=["Room"])


def generate_room_code():
    """Tạo mã phòng 6 số ngẫu nhiên"""
    chars = string.digits
    code = ''.join(random.choices(chars, k=6))
    return code


class RoomOut(BaseModel):
    id: int
    room_code: str
    name: str
    description: Optional[str] = None
    subject_name: Optional[str] = None
    host_id: int
    host_name: str
    max_participants: int = 10
    current_participants: int = 0
    is_public: bool = False
    is_active: bool = True
    created_at: datetime

class RoomMemberOut(BaseModel):
    user_id: int
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str = "member"
    is_online: bool = False
    joined_at: datetime

class CreateRoomRequest(BaseModel):
    name: str
    description: str = ""
    subject_name: str = ""
    host_id: int
    max_participants: int = 10
    is_public: bool = False


@router.post("/create")
async def create_room(req: CreateRoomRequest, db: Session = Depends(get_db)):
    """Tạo phòng học mới → trả mã phòng"""
    for _ in range(10):
        code = generate_room_code()
        existing = db.query(StudyRoom).filter(StudyRoom.room_code == code).first()
        if not existing:
            break
    else:
        raise HTTPException(status_code=500, detail="Không thể tạo mã phòng")

    room = StudyRoom(
        room_code=code,
        name=req.name,
        description=req.description or None,
        subject_name=req.subject_name or None,
        host_id=req.host_id,
        max_participants=req.max_participants,
        is_public=req.is_public,
        is_active=True
    )
    db.add(room)
    db.flush()

    # Host tự động join
    member = StudyRoomMember(room_id=room.id, user_id=req.host_id, role="host")
    db.add(member)
    db.commit()
    db.refresh(room)

    return {"id": room.id, "room_code": code, "message": f"Phòng đã tạo! Mã phòng: {code}"}


@router.post("/join/{code}")
async def join_room(code: str, user_id: int, db: Session = Depends(get_db)):
    """Nhập mã phòng để vào"""
    room = db.query(StudyRoom).filter(
        StudyRoom.room_code == code.upper(),
        StudyRoom.is_active == True
    ).first()
    if not room:
        raise HTTPException(status_code=404, detail="Mã phòng không hợp lệ hoặc phòng đã đóng")

    existing = db.query(StudyRoomMember).filter(
        StudyRoomMember.room_id == room.id,
        StudyRoomMember.user_id == user_id
    ).first()
    if existing:
        return {"id": room.id, "room_code": room.room_code, "message": "Đã ở trong phòng"}

    count = db.query(StudyRoomMember).filter(StudyRoomMember.room_id == room.id).count()
    if count >= room.max_participants:
        raise HTTPException(status_code=400, detail="Phòng đã đầy")

    member = StudyRoomMember(room_id=room.id, user_id=user_id, role="member")
    db.add(member)
    db.commit()
    return {"id": room.id, "room_code": room.room_code, "message": f"Đã vào phòng {room.name}"}


@router.get("/my-rooms", response_model=List[RoomOut])
async def get_my_rooms(user_id: int, db: Session = Depends(get_db)):
    """Phòng của tôi"""
    memberships = db.query(StudyRoomMember).filter(StudyRoomMember.user_id == user_id).all()
    room_ids = [m.room_id for m in memberships]

    rooms = db.query(StudyRoom).filter(
        StudyRoom.id.in_(room_ids),
        StudyRoom.is_active == True
    ).order_by(StudyRoom.updated_at.desc()).all()

    return _rooms_to_output(rooms, db)


@router.get("/public", response_model=List[RoomOut])
async def get_public_rooms(subject: Optional[str] = None, limit: int = 20, db: Session = Depends(get_db)):
    """Phòng công khai"""
    query = db.query(StudyRoom).filter(StudyRoom.is_public == True, StudyRoom.is_active == True)
    if subject:
        query = query.filter(StudyRoom.subject_name.ilike(f"%{subject}%"))
    rooms = query.order_by(StudyRoom.created_at.desc()).limit(limit).all()
    return _rooms_to_output(rooms, db)


@router.get("/{room_id}", response_model=RoomOut)
async def get_room(room_id: int, db: Session = Depends(get_db)):
    """Chi tiết phòng"""
    room = db.query(StudyRoom).filter(StudyRoom.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Phòng không tồn tại")
    return _rooms_to_output([room], db)[0]


@router.get("/{room_id}/members", response_model=List[RoomMemberOut])
async def get_room_members(room_id: int, db: Session = Depends(get_db)):
    """Danh sách thành viên"""
    members = db.query(StudyRoomMember).filter(StudyRoomMember.room_id == room_id).all()
    result = []
    for m in members:
        user = db.query(User).filter(User.id == m.user_id).first()
        is_admin = False
        if user and user.roles:
            is_admin = any(ur.role.role_name == "admin" for ur in user.roles)
            
        if user and not is_admin:
            result.append(RoomMemberOut(
                user_id=user.id, username=user.username,
                full_name=user.full_name, avatar_url=user.avatar_url,
                role=m.role, is_online=m.is_online, joined_at=m.joined_at
            ))
    return result


@router.delete("/{room_id}")
async def close_room(room_id: int, user_id: int, db: Session = Depends(get_db)):
    """Đóng phòng (host only) - Xóa hoàn toàn phòng, tin nhắn, thành viên"""
    from ..models.models import StudyRoomMessage
    
    room = db.query(StudyRoom).filter(StudyRoom.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Phòng không tồn tại")
    if room.host_id != user_id:
        raise HTTPException(status_code=403, detail="Chỉ host mới được đóng phòng")
    
    db.query(StudyRoomMessage).filter(StudyRoomMessage.room_id == room_id).delete()
    db.query(StudyRoomMember).filter(StudyRoomMember.room_id == room_id).delete()
    db.delete(room)
    db.commit()
    return {"message": "Đã xóa phòng hoàn toàn"}


@router.post("/{room_id}/leave")
async def leave_room(room_id: int, user_id: int, db: Session = Depends(get_db)):
    """Rời phòng - Nếu host rời hoặc không còn ai → xóa phòng hoàn toàn (giống Zoom)"""
    from ..models.models import StudyRoomMessage
    
    room = db.query(StudyRoom).filter(StudyRoom.id == room_id).first()
    if not room:
        return {"message": "Phòng không tồn tại"}

    member = db.query(StudyRoomMember).filter(
        StudyRoomMember.room_id == room_id,
        StudyRoomMember.user_id == user_id
    ).first()
    if member:
        db.delete(member)
        db.flush()

    remaining = db.query(StudyRoomMember).filter(StudyRoomMember.room_id == room_id).count()
    is_host = (room.host_id == user_id)

    if is_host or remaining == 0:
        db.query(StudyRoomMessage).filter(StudyRoomMessage.room_id == room_id).delete()
        db.query(StudyRoomMember).filter(StudyRoomMember.room_id == room_id).delete()
        db.delete(room)
        db.commit()
        return {"message": "Phòng đã được giải tán", "room_deleted": True}

    db.commit()
    return {"message": "Đã rời phòng", "room_deleted": False}


def _rooms_to_output(rooms, db):
    result = []
    for room in rooms:
        host = db.query(User).filter(User.id == room.host_id).first()
        count = db.query(StudyRoomMember).filter(StudyRoomMember.room_id == room.id).count()
        result.append(RoomOut(
            id=room.id, room_code=room.room_code, name=room.name,
            description=room.description, subject_name=room.subject_name,
            host_id=room.host_id,
            host_name=host.full_name or host.username if host else "Unknown",
            max_participants=room.max_participants,
            current_participants=count,
            is_public=room.is_public, is_active=room.is_active,
            created_at=room.created_at
        ))
    return result
