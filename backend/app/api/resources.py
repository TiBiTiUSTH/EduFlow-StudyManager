"""
Resource Library API - Upload/Download tài liệu chia sẻ
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import os
import uuid
from ..database import get_db
from ..models.models import Resource, User

router = APIRouter(prefix="/api/resources", tags=["Resources"])

UPLOAD_DIR = "uploads/resources"
ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "image/png": "png",
    "image/jpeg": "jpg",
    "text/plain": "txt",
}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB


class ResourceOut(BaseModel):
    id: int
    user_id: int
    uploader_name: str
    uploader_avatar: Optional[str] = None
    title: str
    description: Optional[str] = None
    subject_name: Optional[str] = None
    grade_level: Optional[str] = None
    file_name: str
    file_url: str
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    download_count: int = 0
    created_at: datetime


@router.post("/upload")
async def upload_resource(
    user_id: int = Form(...),
    title: str = Form(...),
    description: str = Form(""),
    subject_name: str = Form(""),
    grade_level: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload tài liệu"""
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "png", "jpg", "jpeg", "txt"]:
        raise HTTPException(status_code=400, detail=f"Định dạng .{ext} không được hỗ trợ")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File quá lớn (tối đa 50MB)")
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    unique_name = f"{uuid.uuid4().hex[:12]}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)
    with open(file_path, "wb") as f:
        f.write(content)
    resource = Resource(
        user_id=user_id,
        title=title,
        description=description,
        subject_name=subject_name or None,
        grade_level=grade_level or None,
        file_name=file.filename,
        file_url=f"/uploads/resources/{unique_name}",
        file_type=ext,
        file_size=len(content),
        download_count=0,
        is_public=True
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return {"id": resource.id, "message": "Upload thành công", "file_url": resource.file_url}


@router.get("/", response_model=List[ResourceOut])
async def get_resources(
    subject: Optional[str] = None,
    grade: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Lấy danh sách tài liệu"""
    query = db.query(Resource).filter(Resource.is_public == True)

    if subject:
        query = query.filter(Resource.subject_name.ilike(f"%{subject}%"))
    if grade:
        query = query.filter(Resource.grade_level == grade)
    if search:
        query = query.filter(Resource.title.ilike(f"%{search}%"))

    resources = query.order_by(Resource.created_at.desc()).limit(limit).all()

    result = []
    for r in resources:
        user = db.query(User).filter(User.id == r.user_id).first()
        result.append(ResourceOut(
            id=r.id, user_id=r.user_id,
            uploader_name=user.full_name or user.username if user else "Unknown",
            uploader_avatar=user.avatar_url if user else None,
            title=r.title, description=r.description,
            subject_name=r.subject_name, grade_level=r.grade_level,
            file_name=r.file_name, file_url=r.file_url,
            file_type=r.file_type, file_size=r.file_size,
            download_count=r.download_count, created_at=r.created_at
        ))
    return result


@router.get("/{resource_id}/download")
async def download_resource(resource_id: int, db: Session = Depends(get_db)):
    """Tăng download count và trả về file URL"""
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Tài liệu không tồn tại")

    resource.download_count = (resource.download_count or 0) + 1
    db.commit()
    return {"file_url": resource.file_url, "file_name": resource.file_name}


@router.delete("/{resource_id}")
async def delete_resource(resource_id: int, user_id: int, db: Session = Depends(get_db)):
    """Xóa tài liệu (owner only)"""
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Tài liệu không tồn tại")
    if resource.user_id != user_id:
        raise HTTPException(status_code=403, detail="Không có quyền xóa")

    # Xóa file
    try:
        file_path = resource.file_url.lstrip("/")
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception:
        pass

    db.delete(resource)
    db.commit()
    return {"message": "Đã xóa tài liệu"}
