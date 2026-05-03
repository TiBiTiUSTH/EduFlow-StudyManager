from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
import json
from ..database import get_db
from ..models.models import Notification, User
from ..utils.auth import get_current_active_user, get_current_user_ws
from ..api.websocket import manager
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/stms/notifications", tags=["notifications"])

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    notification_type: str
    priority: str
    is_read: bool
    link_url: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()

@router.put("/{notification_id}/read")
async def mark_as_read(notification_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    notification.read_at = datetime.now()
    db.commit()
    return {"message": "Notification marked as read"}

@router.put("/read-all")
async def mark_all_as_read(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db.query(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False).update({
        "is_read": True,
        "read_at": datetime.now()
    }, synchronize_session=False)
    db.commit()
    return {"message": "All notifications marked as read"}

@router.delete("/{notification_id}")
async def delete_notification(notification_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted"}

# Cổng WebSockets
@router.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str, db: Session = Depends(get_db)):
    """
    Cổng WebSocket cho thông báo real-time.
    Client phải truyền JWT token trong URL.
    """
    user = get_current_user_ws(token, db)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await manager.connect(websocket, user.id)
    try:
        while True:
            # Giữ kết nối
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, user.id)

# Hàm phụ trợ tạo thông báo và gửi qua WS
async def create_and_broadcast_notification(db: Session, user_id: int, title: str, message: str, type: str = "system"):
    new_notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    
    ws_message = {
        "event": "new_notification",
        "data": {
            "id": new_notif.id,
            "title": new_notif.title,
            "message": new_notif.message,
            "type": new_notif.type,
            "created_at": new_notif.created_at.isoformat()
        }
    }
    await manager.send_personal_message(json.dumps(ws_message), user_id)
    return new_notif
