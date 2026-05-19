from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from sqlalchemy.orm import joinedload
from typing import List
from pydantic import BaseModel

from ..database import get_db
from ..models import models
from ..utils.auth import get_current_user

router = APIRouter(prefix="/matching", tags=["matching"])

class MatchingSuggestion(BaseModel):
    user_id: int
    name: str
    avatar_url: str | None
    grade_level: str | None
    school_name: str | None
    similarity_score: float
    matched_subjects: List[str]

    class Config:
        from_attributes = True


@router.get("/suggestions", response_model=List[MatchingSuggestion])
async def get_friend_suggestions(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Gợi ý bạn học dựa trên DỮ LIỆU THẬT từ database:
    - Môn học chung (trọng số 0.50)
    - Cùng cấp/lớp (trọng số 0.30)
    - Cùng trường (trọng số 0.20)
    """

    my_grade = current_user.profile.grade_level if current_user.profile and current_user.profile.grade_level else None
    my_school = current_user.profile.school_name if current_user.profile and current_user.profile.school_name else None
    my_subjects = db.query(models.Subject).filter(models.Subject.user_id == current_user.id).all()
    my_subject_names = set(s.subject_name.lower().strip() for s in my_subjects if s.subject_name)
    exclude_ids = {current_user.id}

    existing_rels = db.query(models.FriendRelationship).filter(
        or_(
            models.FriendRelationship.user_id == current_user.id,
            models.FriendRelationship.friend_id == current_user.id
        )
    ).all()
    for rel in existing_rels:
        exclude_ids.add(rel.user_id)
        exclude_ids.add(rel.friend_id)

    pending_reqs = db.query(models.FriendRequest).filter(
        or_(
            and_(models.FriendRequest.sender_id == current_user.id, models.FriendRequest.status == "pending"),
            and_(models.FriendRequest.receiver_id == current_user.id, models.FriendRequest.status == "pending")
        )
    ).all()
    for req in pending_reqs:
        exclude_ids.add(req.sender_id)
        exclude_ids.add(req.receiver_id)

    candidates = db.query(models.User).options(
        joinedload(models.User.profile)
    ).filter(
        models.User.id.notin_(list(exclude_ids)),
        models.User.is_active == True,
        ~models.User.roles.any(models.UserRole.role.has(role_name="admin"))
    ).all()

    candidate_ids = [c.id for c in candidates]
    all_cand_subjects = db.query(models.Subject).filter(models.Subject.user_id.in_(candidate_ids)).all() if candidate_ids else []
    cand_subjects_map = {}
    for s in all_cand_subjects:
        cand_subjects_map.setdefault(s.user_id, []).append(s)

    suggestions = []
    for candidate in candidates:
        score = 0.0
        matched_subjects = []
        cand_subjects = cand_subjects_map.get(candidate.id, [])
        cand_subject_names = set(s.subject_name.lower().strip() for s in cand_subjects if s.subject_name)

        if my_subject_names and cand_subject_names:
            common = my_subject_names & cand_subject_names
            union = my_subject_names | cand_subject_names
            subject_score = len(common) / len(union) if union else 0
            matched_subjects = [s for s in common]
        elif not my_subject_names and not cand_subject_names:
            subject_score = 0.3
        else:
            subject_score = 0.0

        score += subject_score * 0.50
        cand_grade = candidate.profile.grade_level if candidate.profile and candidate.profile.grade_level else None
        if my_grade and cand_grade:
            if my_grade == cand_grade:
                score += 0.30  
            elif my_grade and cand_grade and _same_level(my_grade, cand_grade):
                score += 0.15  
        elif not my_grade and not cand_grade:
            score += 0.15 
            
        cand_school = candidate.profile.school_name if candidate.profile and candidate.profile.school_name else None
        if my_school and cand_school:
            if my_school.lower().strip() == cand_school.lower().strip():
                score += 0.20
        suggestions.append(MatchingSuggestion(
            user_id=candidate.id,
            name=candidate.full_name or candidate.username,
            avatar_url=candidate.avatar_url,
            grade_level=cand_grade,
            school_name=cand_school,
            similarity_score=round(score, 2),
            matched_subjects=[s.title() for s in matched_subjects]
        ))
    suggestions.sort(key=lambda x: x.similarity_score, reverse=True)
    return suggestions[:20]


def _same_level(grade_a: str, grade_b: str) -> bool:
    """Kiểm tra 2 grade có cùng cấp không (cấp 1/2/3/đại học)"""
    level_a = _get_level(grade_a)
    level_b = _get_level(grade_b)
    return level_a == level_b and level_a is not None


def _get_level(grade: str) -> str | None:
    """Phân loại grade vào cấp học"""
    if not grade:
        return None
    g = grade.lower().strip()
    if any(x in g for x in ["lớp 1", "lớp 2", "lớp 3", "lớp 4", "lớp 5", "cấp 1", "tiểu học"]):
        return "cap1"
    if any(x in g for x in ["lớp 6", "lớp 7", "lớp 8", "lớp 9", "cấp 2", "trung học cơ sở", "thcs"]):
        return "cap2"
    if any(x in g for x in ["lớp 10", "lớp 11", "lớp 12", "cấp 3", "trung học phổ thông", "thpt"]):
        return "cap3"
    if any(x in g for x in ["đại học", "cao đẳng", "university", "sinh viên", "năm 1", "năm 2", "năm 3", "năm 4"]):
        return "daihoc"
    return None
