from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, date, timedelta
from ..database import get_db
from ..models.models import PomodoroSession, User, Subject, Task
from ..utils.auth import get_current_active_user
import json
from ..utils.cache import redis_client, get_cache_key, invalidate_cache

router = APIRouter(prefix="/stms/pomodoros", tags=["pomodoros"])

class PomodoroCreate(BaseModel):
    subject_id: Optional[int] = None
    task_id: Optional[int] = None
    work_duration: int = 25
    break_duration: int = 5
    completed_pomodoros: int = 1
    total_focus_time: int = 25 
    interruptions: int = 0
    effectiveness_rating: Optional[int] = None

class PomodoroStats(BaseModel):
    today_sessions: int
    weekly_sessions: int
    total_focus_hours: float

@router.post("/")
async def save_pomodoro_session(session_data: PomodoroCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_session = PomodoroSession(
        user_id=current_user.id,
        subject_id=session_data.subject_id,
        task_id=session_data.task_id,
        session_date=datetime.now(),
        work_duration=session_data.work_duration,
        break_duration=session_data.break_duration,
        completed_pomodoros=session_data.completed_pomodoros,
        total_focus_time=session_data.total_focus_time,
        interruptions=session_data.interruptions,
        effectiveness_rating=session_data.effectiveness_rating
    )
    db.add(db_session)
    db.commit()
    return {"message": "Session saved successfully"}

@router.get("/stats", response_model=PomodoroStats)
async def get_pomodoro_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    now = datetime.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    days_since_monday = now.weekday()
    week_start = today_start - timedelta(days=days_since_monday)

    today_sessions = db.query(func.sum(PomodoroSession.completed_pomodoros))\
        .filter(PomodoroSession.user_id == current_user.id, PomodoroSession.session_date >= today_start)\
        .scalar() or 0
    weekly_sessions = db.query(func.sum(PomodoroSession.completed_pomodoros))\
        .filter(PomodoroSession.user_id == current_user.id, PomodoroSession.session_date >= week_start)\
        .scalar() or 0

    total_minutes = db.query(func.sum(PomodoroSession.total_focus_time))\
        .filter(PomodoroSession.user_id == current_user.id)\
        .scalar() or 0
        
    return {
        "today_sessions": int(today_sessions),
        "weekly_sessions": int(weekly_sessions),
        "total_focus_hours": round(total_minutes / 60, 1)
    }
