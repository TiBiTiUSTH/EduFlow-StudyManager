from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, date
from ..database import get_db
from ..models.models import Schedule, User, Subject
from ..utils.auth import get_current_active_user

router = APIRouter(prefix="/stms/schedules", tags=["schedules"])

class ScheduleBase(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    is_recurring: bool = False
    recurrence_pattern: Optional[str] = None # daily, weekly, monthly
    recurrence_days: Optional[str] = None # JSON string
    recurrence_end_date: Optional[date] = None

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleUpdate(ScheduleBase):
    status: str = "scheduled"

class ScheduleResponse(ScheduleBase):
    id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=List[ScheduleResponse])
async def get_schedules(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return db.query(Schedule).filter(Schedule.user_id == current_user.id).all()

@router.post("/", response_model=ScheduleResponse)
async def create_schedule(schedule: ScheduleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Verify subject belongs to user
    subject = db.query(Subject).filter(Subject.id == schedule.subject_id, Subject.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=400, detail="Invalid subject ID")

    db_schedule = Schedule(
        **schedule.model_dump(),
        user_id=current_user.id,
        created_by=current_user.id
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@router.put("/{schedule_id}", response_model=ScheduleResponse)
async def update_schedule(schedule_id: int, schedule_update: ScheduleUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id, Schedule.user_id == current_user.id).first()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    for key, value in schedule_update.model_dump().items():
        setattr(db_schedule, key, value)
    
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@router.delete("/{schedule_id}")
async def delete_schedule(schedule_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id, Schedule.user_id == current_user.id).first()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    db.delete(db_schedule)
    db.commit()
    return {"message": "Schedule deleted"}
