from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from ..database import get_db
from ..models.models import Task, User, Subject
from ..utils.auth import get_current_active_user

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

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    status: str = "pending"
    completion_percentage: int = 0
    actual_duration: Optional[int] = None

class TaskResponse(TaskBase):
    id: int
    user_id: int
    created_by: int
    status: str
    completion_percentage: int
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=List[TaskResponse])
async def get_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return db.query(Task).filter(Task.user_id == current_user.id).all()

@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Verify subject belongs to user if provided
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
    return db_task

@router.delete("/{task_id}")
async def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted"}
