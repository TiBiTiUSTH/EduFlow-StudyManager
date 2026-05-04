from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, subjects, tasks, schedules, notifications, users, pomodoros, ai, chat, room, admin
from .api.websocket import manager
from .api import community, buddies, dm, resources, video_signaling, matching
import json
from .database import engine, Base
from .models import models  # Ensure models are loaded before creation
import time

# Auto-create tables (with retry logic for slow DB startup)
for _ in range(30):
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
        
        # Seed default roles
        from .database import SessionLocal
        from .models.models import Role
        db = SessionLocal()
        try:
            if not db.query(Role).first():
                db.add_all([
                    Role(role_name="admin", description="Administrator"),
                    Role(role_name="student", description="Student")
                ])
                db.commit()
                print("Default roles seeded.")
        finally:
            db.close()
            
        break
    except Exception as e:
        print(f"Waiting for database to be ready... {e}")
        time.sleep(2)
else:
    raise RuntimeError("Could not connect to database after 30 retries!")

app = FastAPI(title="EduFlow STMS API")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8081", "http://127.0.0.1:8080", "http://127.0.0.1:8081", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(subjects.router)
app.include_router(tasks.router)
app.include_router(schedules.router)
app.include_router(notifications.router)
app.include_router(users.router)
app.include_router(pomodoros.router)
app.include_router(ai.router)
app.include_router(chat.router)
app.include_router(room.router)
app.include_router(community.router)
app.include_router(buddies.router)
app.include_router(dm.router)
app.include_router(resources.router)
app.include_router(video_signaling.router)
app.include_router(matching.router)
app.include_router(admin.router)

import os
from fastapi.staticfiles import StaticFiles

os.makedirs("uploads/avatars", exist_ok=True)
os.makedirs("uploads/resources", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# WebSocket Endpoint


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    """WebSocket chính - xử lý tất cả real-time events"""
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            msg_type = message.get("type", "")

            if msg_type == "join_room":
                room_id = message.get("room_id")
                if room_id:
                    manager.join_room(str(room_id), user_id)
                    await manager.broadcast_to_room(str(room_id), {
                        "type": "user_joined",
                        "user_id": user_id,
                        "room_id": room_id
                    }, exclude_user=user_id)

            elif msg_type == "leave_room":
                room_id = message.get("room_id")
                if room_id:
                    manager.leave_room(str(room_id), user_id)
                    await manager.broadcast_to_room(str(room_id), {
                        "type": "user_left",
                        "user_id": user_id,
                        "room_id": room_id
                    })

            elif msg_type == "room_message":
                room_id = message.get("room_id")
                msg_content = message.get("message", "")
                if room_id and msg_content:
                    await manager.broadcast_to_room(str(room_id), {
                        "type": "room_message",
                        "room_id": room_id,
                        "user_id": user_id,
                        "message": msg_content,
                        "timestamp": str(__import__('datetime').datetime.now())
                    })

            elif msg_type == "channel_message":
                channel_id = message.get("channel_id")
                msg_content = message.get("message", "")
                msg_id = message.get("id")
                username = message.get("username", "Unknown")
                if channel_id and msg_content:
                    await manager.broadcast_to_room(f"channel_{channel_id}", {
                        "type": "channel_message",
                        "channel_id": channel_id,
                        "user_id": user_id,
                        "message": msg_content,
                        "id": msg_id,
                        "username": username,
                        "timestamp": str(__import__('datetime').datetime.now())
                    })

                    # Thông báo chuông cho thành viên offline
                    try:
                        from .database import SessionLocal
                        from .models.models import SubjectChannelMember, SubjectChannel, Notification, User
                        from datetime import datetime, timedelta

                        notify_db = SessionLocal()
                        try:
                            channel = notify_db.query(SubjectChannel).filter(SubjectChannel.id == channel_id).first()
                            if channel:
                                channel_name = channel.subject_name
                                members = notify_db.query(SubjectChannelMember).filter(
                                    SubjectChannelMember.channel_id == channel_id
                                ).all()
                                online_in_room = manager.get_room_members(f"channel_{channel_id}")
                                sender = notify_db.query(User).filter(User.id == user_id).first()
                                sender_name = (sender.full_name or sender.username) if sender else username
                                five_min_ago = datetime.now() - timedelta(minutes=5)

                                for m in members:
                                    if m.user_id == user_id:
                                        continue
                                    if m.user_id in online_in_room:
                                        continue

                                    recent = notify_db.query(Notification).filter(
                                        Notification.user_id == m.user_id,
                                        Notification.notification_type == "community_message",
                                        Notification.title.contains(channel_name),
                                        Notification.created_at > five_min_ago
                                    ).first()
                                    if recent:
                                        continue

                                    notif = Notification(
                                        user_id=m.user_id,
                                        sender_id=user_id,
                                        notification_type="community_message",
                                        title=f"Tin nhắn mới trong {channel_name}",
                                        message=f"{sender_name}: {msg_content[:80]}",
                                        link_url="/stms/student/community/group",
                                        priority="low",
                                        is_read=False
                                    )
                                    notify_db.add(notif)

                                    if manager.is_online(m.user_id):
                                        await manager.send_personal(m.user_id, {
                                            "type": "new_notification",
                                            "event": "new_notification",
                                            "data": {
                                                "title": notif.title,
                                                "message": notif.message,
                                                "notification_type": "community_message",
                                                "link_url": notif.link_url
                                            }
                                        })

                                notify_db.commit()
                        finally:
                            notify_db.close()
                    except Exception as notif_err:
                        print(f"[WS] Notification error: {notif_err}")

            elif msg_type == "channel_deleted":
                channel_id = message.get("channel_id")
                if channel_id:
                    await manager.broadcast_to_room(f"channel_{channel_id}", {
                        "type": "channel_deleted",
                        "channel_id": channel_id
                    })

            elif msg_type == "member_kicked":
                channel_id = message.get("channel_id")
                kicked_user_id = message.get("user_id")
                if channel_id and kicked_user_id:
                    await manager.broadcast_to_room(f"channel_{channel_id}", {
                        "type": "member_kicked",
                        "channel_id": channel_id,
                        "user_id": kicked_user_id
                    })

            elif msg_type == "room_closed":
                room_id = message.get("room_id")
                if room_id:
                    await manager.broadcast_to_room(str(room_id), {
                        "type": "room_closed",
                        "room_id": room_id
                    })

            elif msg_type == "media_status":
                room_id = message.get("room_id")
                if room_id:
                    await manager.broadcast_to_room(str(room_id), {
                        "type": "media_status",
                        "user_id": user_id,
                        "muted": message.get("muted", False),
                        "videoOff": message.get("videoOff", False)
                    }, exclude_user=user_id)

            #Tín hiệu WebRTC
            elif msg_type == "webrtc_offer":
                receiver_id = message.get("receiver_id")
                if receiver_id:
                    await manager.send_personal(receiver_id, {
                        "type": "webrtc_offer",
                        "sender_id": user_id,
                        "offer": message.get("offer")
                    })

            elif msg_type == "webrtc_answer":
                receiver_id = message.get("receiver_id")
                if receiver_id:
                    await manager.send_personal(receiver_id, {
                        "type": "webrtc_answer",
                        "sender_id": user_id,
                        "answer": message.get("answer")
                    })

            elif msg_type == "webrtc_ice_candidate":
                receiver_id = message.get("receiver_id")
                if receiver_id:
                    await manager.send_personal(receiver_id, {
                        "type": "webrtc_ice_candidate",
                        "sender_id": user_id,
                        "candidate": message.get("candidate")
                    })

            elif msg_type == "direct_message":
                receiver_id = message.get("receiver_id")
                msg_content = message.get("message", "")
                if receiver_id and msg_content:
                    await manager.send_personal(receiver_id, {
                        "type": "direct_message",
                        "sender_id": user_id,
                        "message": msg_content,
                        "timestamp": str(__import__('datetime').datetime.now())
                    })

                    # Tạo thông báo cho tin nhắn trực tiếp
                    try:
                        from .database import SessionLocal
                        from .models.models import Notification, User
                        from datetime import datetime, timedelta

                        dm_db = SessionLocal()
                        try:
                            sender = dm_db.query(User).filter(User.id == user_id).first()
                            sender_name = (sender.full_name or sender.username) if sender else "Unknown"

                            five_min_ago = datetime.now() - timedelta(minutes=5)
                            recent = dm_db.query(Notification).filter(
                                Notification.user_id == receiver_id,
                                Notification.sender_id == user_id,
                                Notification.notification_type == "direct_message",
                                Notification.created_at > five_min_ago
                            ).first()

                            if not recent:
                                notif = Notification(
                                    user_id=receiver_id,
                                    sender_id=user_id,
                                    notification_type="direct_message",
                                    title=f"Tin nhắn từ {sender_name}",
                                    message=f"{sender_name}: {msg_content[:80]}",
                                    link_url="/stms/student/community/friends",
                                    priority="low",
                                    is_read=False
                                )
                                dm_db.add(notif)
                                dm_db.commit()
                                dm_db.refresh(notif)

                                # Gửi thông báo WS
                                await manager.send_personal(receiver_id, {
                                    "type": "new_notification",
                                    "event": "new_notification",
                                    "data": {
                                        "id": notif.id,
                                        "title": notif.title,
                                        "message": notif.message,
                                        "notification_type": "direct_message",
                                        "link_url": notif.link_url,
                                        "is_read": False,
                                        "created_at": str(notif.created_at)
                                    }
                                })
                        finally:
                            dm_db.close()
                    except Exception as dm_notif_err:
                        print(f"[WS] DM Notification error: {dm_notif_err}")

            elif msg_type == "typing":
                room_id = message.get("room_id")
                if room_id:
                    await manager.broadcast_to_room(str(room_id), {
                        "type": "typing",
                        "user_id": user_id,
                        "room_id": room_id
                    }, exclude_user=user_id)

            # Tín hiệu Video Call
            elif msg_type in ("video_offer", "video_answer", "ice_candidate", "call_request", "call_accept", "call_reject", "call_end"):
                target_id = message.get("target_id")
                if target_id:
                    await manager.send_personal(target_id, {
                        **message,
                        "sender_id": user_id
                    })

    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception as e:
        print(f"[WS] Error: {e}")
        manager.disconnect(websocket, user_id)


@app.get("/")
async def root():
    return {"message": "Welcome to EduFlow STMS API", "status": "running"}

@app.get("/stms/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "database": "PostgreSQL",
        "websocket": True,
        "online_users": len(manager.get_online_users())
    }
