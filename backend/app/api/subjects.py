from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from ..database import get_db
from ..models.models import Subject, User
from ..utils.auth import get_current_active_user
import os
import shutil

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
    from ..models.models import Task, Schedule, SubjectStatistic
    
    db_subject = db.query(Subject).filter(Subject.id == subject_id, Subject.user_id == current_user.id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    db.query(Task).filter(Task.subject_id == subject_id).update({"subject_id": None}, synchronize_session=False)
    
    db.query(Schedule).filter(Schedule.subject_id == subject_id).delete(synchronize_session=False)
    
    db.query(SubjectStatistic).filter(SubjectStatistic.subject_id == subject_id).delete(synchronize_session=False)

    upload_dir = f"uploads/subjects/{current_user.id}/{subject_id}"
    if os.path.exists(upload_dir):
        shutil.rmtree(upload_dir)
    
    db.delete(db_subject)
    db.commit()
    return {"message": "Đã xóa môn học và toàn bộ dữ liệu liên quan"}

# Tài liệu môn học
@router.post("/{subject_id}/upload")
async def upload_subject_doc(subject_id: int, file: UploadFile = File(...), doc_type: str = Form("lecture"), db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    upload_dir = f"uploads/subjects/{current_user.id}/{subject_id}"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = f"{upload_dir}/{file.filename}"
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    return {"message": "File uploaded", "name": file.filename, "type": doc_type, "path": file_path}

@router.get("/{subject_id}/files")
async def list_subject_files(subject_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    upload_dir = f"uploads/subjects/{current_user.id}/{subject_id}"
    if not os.path.exists(upload_dir):
        return []
    
    files = []
    for fname in os.listdir(upload_dir):
        fpath = os.path.join(upload_dir, fname)
        if os.path.isfile(fpath):
            size_kb = round(os.path.getsize(fpath) / 1024, 1)
            files.append({"name": fname, "size_kb": size_kb, "path": fpath})
    return files

@router.delete("/{subject_id}/files/{file_name}")
async def delete_subject_file(subject_id: int, file_name: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    file_path = f"uploads/subjects/{current_user.id}/{subject_id}/{file_name}"
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"message": "File deleted"}
    raise HTTPException(status_code=404, detail="File not found")

@router.get("/{subject_id}/files/{file_name}/download")
async def download_subject_file(subject_id: int, file_name: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    from fastapi.responses import FileResponse
    file_path = f"uploads/subjects/{current_user.id}/{subject_id}/{file_name}"
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=file_name)
    raise HTTPException(status_code=404, detail="File not found")


