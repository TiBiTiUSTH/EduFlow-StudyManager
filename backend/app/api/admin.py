from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models.models import User, Task, StudyRoom, StudySession, Role, UserRole
from ..utils.auth import get_current_user
import psutil
import time
import json
import os
from typing import List, Dict
from pydantic import BaseModel

router = APIRouter(prefix="/stms/admin", tags=["admin"])

CONFIG_FILE = "server_config.json"

class SystemSettings(BaseModel):
    smtp_host: str
    smtp_port: str
    db_pool_size: str
    cache_ttl: str
    max_upload_size: str
    maintenance_mode: bool = False
    auto_scan: bool = True

def get_config():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    return {
        "smtp_host": "smtp.eduflow.io",
        "smtp_port": "587",
        "db_pool_size": "20",
        "cache_ttl": "3600",
        "max_upload_size": "50",
        "maintenance_mode": False,
        "auto_scan": True
    }

def save_config(config: dict):
    with open(CONFIG_FILE, "w") as f:
        json.dump(config, f, indent=4)

# Hàm kiểm tra quyền admin
async def get_current_admin(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_roles = [r.role.role_name for r in current_user.roles]
    if "admin" not in user_roles:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    # Đếm người dùng nhưng loại trừ những người có role là 'admin'
    total_users = db.query(User).filter(
        ~User.roles.any(UserRole.role.has(role_name="admin"))
    ).count()
    
    active_rooms = db.query(StudyRoom).filter(StudyRoom.is_active == True).count()
    completed_tasks = db.query(Task).filter(Task.status == "completed").count()
    
    return {
        "total_users": total_users,
        "active_rooms": active_rooms,
        "completed_tasks": completed_tasks
    }

@router.get("/system-health")
def get_system_health(current_admin: User = Depends(get_current_admin)):
    cpu_percent = psutil.cpu_percent(interval=0.5)
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    
    return {
        "cpu_usage": cpu_percent,
        "ram_usage": ram.percent,
        "disk_usage": disk.percent,
        "uptime_seconds": time.time() - psutil.boot_time()
    }

@router.get("/logs")
def get_admin_logs(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    logs = []
    
    # 1. Real User Registrations
    recent_users = db.query(User).order_by(User.created_at.desc()).limit(10).all()
    for u in recent_users:
        if u.created_at:
            dt = u.created_at.strftime("%Y-%m-%d %H:%M")
            sort_val = u.created_at
        else:
            dt = "Gần đây"
            from datetime import datetime
            sort_val = datetime.min
            
        logs.append({
            "id": f"log_user_{u.id}",
            "action": "New User Registration",
            "details": f"User {u.username} joined the system.",
            "timestamp": dt,
            "pid": u.id,  # Use User ID as PID representation instead of random
            "sort_val": sort_val
        })
        
    # 2. Real Task Updates
    recent_tasks = db.query(Task).order_by(Task.created_at.desc()).limit(10).all()
    for t in recent_tasks:
        if t.created_at:
            dt = t.created_at.strftime("%Y-%m-%d %H:%M")
            sort_val = t.created_at
        else:
            dt = "Gần đây"
            from datetime import datetime
            sort_val = datetime.min
            
        logs.append({
            "id": f"log_task_{t.id}",
            "action": "Task Update",
            "details": f"Task '{t.title[:20]}...' was created or updated.",
            "timestamp": dt,
            "pid": t.id,
            "sort_val": sort_val
        })
         
    # Sort by actual time descending
    logs.sort(key=lambda x: x["sort_val"], reverse=True)
    
    # Remove sort key before returning
    for log in logs:
        del log["sort_val"]
        
    return logs[:10]

@router.get("/settings")
def get_system_settings(current_admin: User = Depends(get_current_admin)):
    return get_config()

@router.post("/settings")
def update_system_settings(settings: SystemSettings, current_admin: User = Depends(get_current_admin)):
    save_config(settings.dict())
    return {"status": "success", "message": "Settings updated successfully"}

@router.post("/cleanup")
def cleanup_database(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Dọn dẹp dữ liệu cũ: OTP hết hạn, thông báo cũ, cache Redis"""
    from ..models.models import Notification
    from datetime import datetime, timedelta
    from ..utils.cache import redis_client

    cleaned = 0

    # 1. Xóa OTP code đã dùng hoặc hết hạn
    expired_otp = db.query(User).filter(User.otp_code != None, User.is_verified == True).all()
    for u in expired_otp:
        u.otp_code = None
        cleaned += 1

    # 2. Xóa thông báo cũ hơn 30 ngày
    cutoff = datetime.now() - timedelta(days=30)
    old_notifs = db.query(Notification).filter(Notification.created_at < cutoff).delete(synchronize_session=False)
    cleaned += old_notifs

    db.commit()

    # 3. Xóa cache Redis
    cache_cleared = 0
    try:
        keys = redis_client.keys("cache:*")
        if keys:
            cache_cleared = len(keys)
            redis_client.delete(*keys)
    except Exception:
        pass

    return {
        "status": "success",
        "message": f"Đã dọn dẹp {cleaned} bản ghi orphaned và xóa {cache_cleared} cache entries."
    }
