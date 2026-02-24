from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from ..database import get_db
from ..models.models import Subject, User
from ..utils.auth import get_current_active_user

router = APIRouter(prefix="/stms/subjects", tags=["subjects"])

class SubjectBase(BaseModel):
    subject_name: str
    subject_code: str = None
    color_code: str = "#3b82f6"
    description: str = None
    target_hours_per_week: int = 5
    priority: str = "medium"

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(SubjectBase):
    is_active: bool = True

class SubjectResponse(SubjectBase):
    id: int
    user_id: int
    is_active: bool

    class Config:
        from_attributes = True

@router.get("/", response_model=List[SubjectResponse])
async def get_subjects(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return db.query(Subject).filter(Subject.user_id == current_user.id).all()

@router.post("/", response_model=SubjectResponse)
async def create_subject(subject: SubjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_subject = Subject(**subject.model_dump(), user_id=current_user.id)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.get("/{subject_id}", response_model=SubjectResponse)
async def get_subject(subject_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

@router.put("/{subject_id}", response_model=SubjectResponse)
async def update_subject(subject_id: int, subject_update: SubjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_subject = db.query(Subject).filter(Subject.id == subject_id, Subject.user_id == current_user.id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    for key, value in subject_update.model_dump().items():
        setattr(db_subject, key, value)
    
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.delete("/{subject_id}")
async def delete_subject(subject_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_subject = db.query(Subject).filter(Subject.id == subject_id, Subject.user_id == current_user.id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    db.delete(db_subject)
    db.commit()
    return {"message": "Subject deleted"}
