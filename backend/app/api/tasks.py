from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from ..database import get_db
from ..models.models import Task, User, Subject, TaskGroup
from ..utils.auth import get_current_active_user
import json
import os
import shutil
from ..utils.cache import redis_client, get_cache_key, invalidate_cache
from fastapi import UploadFile, File
from decimal import Decimal

router = APIRouter(prefix="/stms/tasks", tags=["tasks"])

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    subject_id: Optional[int] = None
    task_type: str = "assignment"
    priority: str = "medium"
    difficulty: Optional[str] = None
    due_date: Optional[datetime] = None
    estimated_duration: Optional[int] = None
    group_id: Optional[int] = None
    parent_task_id: Optional[int] = None
    is_reviewable: Optional[bool] = False
    ai_suggested: Optional[bool] = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    status: Optional[str] = None
    completion_percentage: Optional[int] = None
    actual_duration: Optional[int] = None
    attachments: Optional[str] = None

class TaskResponse(TaskBase):
    id: int
    user_id: int
    created_by: int
    status: str
    completion_percentage: int
    attachments: Optional[str] = None
    group_id: Optional[int] = None
    parent_task_id: Optional[int] = None
    is_reviewable: bool
    sm2_interval: int
    sm2_repetitions: int
    sm2_easiness_factor: float
    next_review_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Nhóm Nhiệm Vụ Schemas
class GroupCreate(BaseModel):
    name: str
    color: str = '#6366f1'

class GroupResponse(BaseModel):
    id: int
    name: str
    color: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=List[TaskResponse])
async def get_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    cache_key = f"cache:/stms/tasks:user:{current_user.id}"
    try:
        cached_data = redis_client.get(cache_key)
        if cached_data:
            print(f"[REDIS CACHE HIT] Served tasks for user {current_user.id}")
            return json.loads(cached_data)
    except Exception as e:
        print(f"[REDIS ERROR] {str(e)}")

    print(f"[REDIS CACHE MISS] Querying DB for tasks of user {current_user.id}")
    tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
    
    # Cache kết quả thủ công
    try:
        tasks_list = []
        for t in tasks:
            d = t.__dict__.copy()
            d.pop('_sa_instance_state', None)
            for k, v in d.items():
                if hasattr(v, 'isoformat'):
                    d[k] = str(v)
                elif isinstance(v, Decimal):
                    d[k] = float(v)
            tasks_list.append(d)
        redis_client.setex(cache_key, 180, json.dumps(tasks_list)) # cache 3 phút
    except Exception as e:
        print(f"[REDIS ERROR] Could not cache tasks: {str(e)}")
        
    return tasks

@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Kiểm tra môn học thuộc về user
    if task.subject_id:
        subject = db.query(Subject).filter(Subject.id == task.subject_id, Subject.user_id == current_user.id).first()
        if not subject:
            raise HTTPException(status_code=400, detail="Invalid subject ID")

    db_task = Task(
        **task.model_dump(), 
        user_id=current_user.id, 
        created_by=current_user.id,
        status="pending"
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    # Xóa cache
    invalidate_cache("/stms/tasks", current_user.id)
    
    return db_task

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for key, value in task_update.model_dump().items():
        setattr(db_task, key, value)
    
    if task_update.status == "completed" and not db_task.completion_date:
        db_task.completion_date = datetime.now()
        db_task.completion_percentage = 100
    
    db.commit()
    db.refresh(db_task)

    # Xóa cache
    invalidate_cache("/stms/tasks", current_user.id)

    return db_task

@router.delete("/{task_id}")
async def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    from ..models.models import PomodoroSession, TaskChatHistory, Schedule
    
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Xóa subtask
    db.query(Task).filter(Task.parent_task_id == task_id).delete(synchronize_session=False)

    db.query(TaskChatHistory).filter(TaskChatHistory.task_id == task_id).delete(synchronize_session=False)

    db.query(PomodoroSession).filter(PomodoroSession.task_id == task_id).delete(synchronize_session=False)

    # Xóa lịch liên quan đến task (auto-schedule tạo ra)
    task_title = db_task.title
    if task_title:
        db.query(Schedule).filter(
            Schedule.user_id == current_user.id,
            Schedule.title.contains(task_title)
        ).delete(synchronize_session=False)

    if db_task.attachments:
        try:
            files = json.loads(db_task.attachments)
            for f in files:
                if os.path.exists(f.get("path", "")):
                    os.remove(f["path"])
        except Exception:
            pass

    # 5. Xóa nhiệm vụ
    db.delete(db_task)
    db.commit()

    # Xóa cache
    invalidate_cache("/stms/tasks", current_user.id)
    invalidate_cache("/stms/schedules", current_user.id)

    return {"message": "Đã xóa nhiệm vụ và toàn bộ dữ liệu liên quan"}

class TaskReview(BaseModel):
    quality: int

@router.post("/{task_id}/review", response_model=TaskResponse)
async def review_task(task_id: int, review: TaskReview, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """
    Gửi điểm đánh giá (0-5) để tính ngày ôn tập tiếp theo bằng thuật toán SM-2.
    """
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    q = review.quality
    if q < 0 or q > 5:
        raise HTTPException(status_code=400, detail="Quality must be between 0 and 5")
        
    if not db_task.is_reviewable:
        db_task.is_reviewable = True
        
    if q >= 3:
        if db_task.sm2_repetitions == 0:
            db_task.sm2_interval = 1
        elif db_task.sm2_repetitions == 1:
            db_task.sm2_interval = 6
        else:
            db_task.sm2_interval = int(round(db_task.sm2_interval * float(db_task.sm2_easiness_factor)))
        db_task.sm2_repetitions += 1
    else:
        db_task.sm2_repetitions = 0
        db_task.sm2_interval = 1
        
    ef = float(db_task.sm2_easiness_factor) + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    if ef < 1.3:
        ef = 1.3
    db_task.sm2_easiness_factor = ef
    
    from datetime import timedelta
    db_task.next_review_date = datetime.now() + timedelta(days=db_task.sm2_interval)
    
    db.commit()
    db.refresh(db_task)
    invalidate_cache("/stms/tasks", current_user.id)
    
    return db_task

@router.post("/{task_id}/upload")
async def upload_task_file(task_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    upload_dir = f"uploads/tasks/{current_user.id}"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = f"{upload_dir}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Lưu danh sách file dưới dạng JSON
    existing = json.loads(db_task.attachments) if db_task.attachments else []
    existing.append({"name": file.filename, "path": file_path})
    db_task.attachments = json.dumps(existing)
    db.commit()

    invalidate_cache("/stms/tasks", current_user.id)
    return {"message": "File uploaded", "files": existing}

# Task Groups
@router.get("/groups", response_model=List[GroupResponse])
async def get_groups(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return db.query(TaskGroup).filter(TaskGroup.user_id == current_user.id).order_by(TaskGroup.created_at.asc()).all()

@router.post("/groups", response_model=GroupResponse)
async def create_group(group: GroupCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_group = TaskGroup(user_id=current_user.id, name=group.name, color=group.color)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@router.delete("/groups/{group_id}")
async def delete_group(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    group = db.query(TaskGroup).filter(TaskGroup.id == group_id, TaskGroup.user_id == current_user.id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    # Hủy liên kết các tác vụ khỏi nhóm này
    db.query(Task).filter(Task.group_id == group_id).update({"group_id": None})
    db.delete(group)
    db.commit()
    return {"message": "Group deleted"}
