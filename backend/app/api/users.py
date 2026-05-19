from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil
import glob
from uuid import uuid4
from ..database import get_db
from ..models.models import User, UserProfile
from ..utils.auth import get_current_user
from ..utils.security import get_password_hash, verify_password
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter(prefix="/stms/users", tags=["users"])

class UserProfileUpdate(BaseModel):
    # Thông tin cơ bản
    full_name: Optional[str] = None
    password: Optional[str] = None
    avatar_url: Optional[str] = None
    
    school_name: Optional[str] = None
    grade_level: Optional[str] = None
    student_code: Optional[str] = None
    study_goal: Optional[str] = None
    daily_study_target: Optional[int] = None

@router.get("/me")
async def get_my_profile(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Returns the current user's profile information.
    Includes extended profile data if they have one (e.g. Students).
    """
    user_roles = [ur.role.role_name for ur in current_user.roles]
    profile_data = None
    
    if "student" in user_roles:
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        if profile:
            profile_data = {
                "school_name": profile.school_name,
                "grade_level": profile.grade_level,
                "student_code": profile.student_code,
                "study_goal": profile.study_goal,
                "daily_study_target": profile.daily_study_target
            }
            
    # Chuyển đổi avatar_url cũ sang relative URL
    avatar = current_user.avatar_url
    if avatar and avatar.startswith("http://127.0.0.1:8000"):
        avatar = avatar.replace("http://127.0.0.1:8000", "")
    elif avatar and avatar.startswith("http://localhost:8000"):
        avatar = avatar.replace("http://localhost:8000", "")

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "avatar_url": avatar,
        "roles": user_roles,
        "profile": profile_data
    }

@router.put("/me")
async def update_my_profile(
    update_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates the current user's profile.
    If the user is a student, it also updates their academic profile.
    """
    if update_data.full_name is not None and update_data.full_name != "":
        current_user.full_name = update_data.full_name
        
    if update_data.password is not None and update_data.password != "":
        current_user.password_hash = get_password_hash(update_data.password)
        
    if update_data.avatar_url is not None:
        current_user.avatar_url = update_data.avatar_url
        
    # Cập nhật Profile
    user_roles = [ur.role.role_name for ur in current_user.roles]
    if "student" in user_roles:
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        if not profile:
            # Tạo mới nếu chưa có
            profile = UserProfile(user_id=current_user.id)
            db.add(profile)
            
        if update_data.school_name is not None:
            profile.school_name = update_data.school_name
        if update_data.grade_level is not None:
            profile.grade_level = update_data.grade_level
        if update_data.student_code is not None:
            profile.student_code = update_data.student_code
        if update_data.study_goal is not None:
            profile.study_goal = update_data.study_goal
        if update_data.daily_study_target is not None:
            profile.daily_study_target = update_data.daily_study_target

    db.commit()
    db.refresh(current_user)
    
    return {"message": "Profile updated successfully"}

@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Uploads a new avatar image and updates the user's avatar_url.
    """
    # Kiểm tra định dạng file
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload JPG, PNG, GIF, or WEBP."
        )

    # Tạo tên file
    unique_filename = f"{current_user.id}_{uuid4().hex}{ext}"
    upload_dir = "uploads/avatars"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, unique_filename)

    # Lưu file
    try:
        with open(file_path, "wb") as buffer:
            
            while content := await file.read(1024 * 1024): 
                buffer.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )
    finally:
        await file.close()

    # Cập nhật database
    avatar_url = f"/uploads/avatars/{unique_filename}"
    current_user.avatar_url = avatar_url
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Avatar uploaded successfully",
        "avatar_url": avatar_url
    }

class PasswordVerify(BaseModel):
    password: str

@router.post("/verify-password")
async def verify_user_password(
    body: PasswordVerify,
    current_user: User = Depends(get_current_user)
):
    """Verify user's current password before sensitive actions."""
    if not verify_password(body.password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Mật khẩu không đúng")
    return {"verified": True}

@router.delete("/me")
async def delete_my_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permanently deletes the current user's account and all associated data.
    This action is irreversible. The User model has cascade delete configured,
    so all related records (roles, profile, tasks, schedules, etc.) will be removed.
    """
    # 1. Xóa tất cả avatar của user
    try:
        avatar_pattern = os.path.join("uploads", "avatars", f"{current_user.id}_*")
        for f in glob.glob(avatar_pattern):
            try:
                os.remove(f)
            except Exception:
                pass
    except Exception as e:
        print(f"Error cleaning avatars: {e}")

    # 2. Xóa các thư mục riêng của user
    uid_str = str(current_user.id)
    dirs_to_remove = [
        os.path.join("uploads", "ai", uid_str),
        os.path.join("uploads", "subjects", uid_str),
        os.path.join("uploads", "tasks", uid_str)
    ]
    
    for d in dirs_to_remove:
        try:
            if os.path.exists(d):
                shutil.rmtree(d)
        except Exception as e:
            print(f"Error cleaning directory {d}: {e}")

    from ..models.models import (
        Task, Subject, PomodoroSession, Schedule, Notification, 
        ChatHistory, AIInteraction, 
        StudySession, SubjectStatistic, Note, Goal, GoalProgressLog, UserRole,
        UserProfile, UserPreference, UserAchievement, TaskGroup, SystemSetting,
        StudyReport, Feedback, ActivityLog,
        FriendRequest, FriendRelationship, DirectMessage,
        SubjectChannelMember, SubjectChannelMessage, ChannelJoinRequest, SubjectChannel,
        StudyRoomMember, StudyRoomMessage, StudyRoom,
        Resource, TaskChatHistory
    )

    uid = current_user.id

    db.query(Notification).filter(Notification.sender_id == uid).update({"sender_id": None}, synchronize_session=False)
    db.query(UserRole).filter(UserRole.assigned_by == uid).update({"assigned_by": None}, synchronize_session=False)
    db.query(SystemSetting).filter(SystemSetting.updated_by == uid).update({"updated_by": None}, synchronize_session=False)
    db.query(Feedback).filter(Feedback.resolved_by == uid).update({"resolved_by": None}, synchronize_session=False)

    # Xóa dữ liệu phụ thuộc
    goals = db.query(Goal).filter((Goal.user_id == uid) | (Goal.created_by == uid)).all()
    if goals:
        goal_ids = [g.id for g in goals]
        db.query(GoalProgressLog).filter(GoalProgressLog.goal_id.in_(goal_ids)).delete(synchronize_session=False)

    # Xóa dữ liệu phụ thuộc trực tiếp vào User
    db.query(StudySession).filter(StudySession.user_id == uid).delete(synchronize_session=False)
    db.query(PomodoroSession).filter(PomodoroSession.user_id == uid).delete(synchronize_session=False)
    db.query(Task).filter((Task.user_id == uid) | (Task.created_by == uid)).delete(synchronize_session=False)
    db.query(Schedule).filter((Schedule.user_id == uid) | (Schedule.created_by == uid)).delete(synchronize_session=False)
    db.query(StudyReport).filter(StudyReport.user_id == uid).delete(synchronize_session=False)
    db.query(SubjectStatistic).filter(SubjectStatistic.user_id == uid).delete(synchronize_session=False)
    
    # An toàn để xóa Subjects, TaskGroups, Goals
    db.query(Subject).filter(Subject.user_id == uid).delete(synchronize_session=False)
    db.query(TaskGroup).filter(TaskGroup.user_id == uid).delete(synchronize_session=False)
    db.query(Goal).filter((Goal.user_id == uid) | (Goal.created_by == uid)).delete(synchronize_session=False)

    # Xóa dữ liệu độc lập của user
    db.query(Note).filter(Note.user_id == uid).delete(synchronize_session=False)
    db.query(UserAchievement).filter(UserAchievement.user_id == uid).delete(synchronize_session=False)
    db.query(Notification).filter(Notification.user_id == uid).delete(synchronize_session=False)
    db.query(ChatHistory).filter(ChatHistory.user_id == uid).delete(synchronize_session=False)
    db.query(TaskChatHistory).filter(TaskChatHistory.user_id == uid).delete(synchronize_session=False)
    db.query(AIInteraction).filter(AIInteraction.user_id == uid).delete(synchronize_session=False)
    db.query(ActivityLog).filter(ActivityLog.user_id == uid).delete(synchronize_session=False)
    db.query(Feedback).filter(Feedback.user_id == uid).delete(synchronize_session=False)
    


    
    # Tin nhắn trực tiếp
    db.query(DirectMessage).filter(
        (DirectMessage.sender_id == uid) | (DirectMessage.receiver_id == uid)
    ).delete(synchronize_session=False)

    # Yêu cầu & Quan hệ
    db.query(FriendRequest).filter(
        (FriendRequest.sender_id == uid) | (FriendRequest.receiver_id == uid)
    ).delete(synchronize_session=False)
    db.query(FriendRelationship).filter(
        (FriendRelationship.user_id == uid) | (FriendRelationship.friend_id == uid)
    ).delete(synchronize_session=False)

    # Tin nhắn Channel 
    db.query(SubjectChannelMessage).filter(SubjectChannelMessage.user_id == uid).delete(synchronize_session=False)

    # Thành viên Channel & Yêu cầu tham gia
    db.query(SubjectChannelMember).filter(SubjectChannelMember.user_id == uid).delete(synchronize_session=False)
    db.query(ChannelJoinRequest).filter(ChannelJoinRequest.user_id == uid).delete(synchronize_session=False)

    # Channels tạo bởi user
    user_channels = db.query(SubjectChannel).filter(SubjectChannel.creator_id == uid).all()
    for ch in user_channels:
        db.delete(ch)

    # Tin nhắn & Thành viên 
    db.query(StudyRoomMessage).filter(StudyRoomMessage.user_id == uid).delete(synchronize_session=False)
    db.query(StudyRoomMember).filter(StudyRoomMember.user_id == uid).delete(synchronize_session=False)

    # Study Rooms do user host
    user_rooms = db.query(StudyRoom).filter(StudyRoom.host_id == uid).all()
    for room in user_rooms:
        db.delete(room)

    # Tài liệu
    user_resources = db.query(Resource).filter(Resource.user_id == uid).all()
    for res in user_resources:
        try:
            file_path = res.file_url.lstrip("/")
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception:
            pass
        db.delete(res)

    # Cuối cùng xóa các quan hệ trực tiếp của User
    db.query(UserProfile).filter(UserProfile.user_id == uid).delete(synchronize_session=False)
    db.query(UserPreference).filter(UserPreference.user_id == uid).delete(synchronize_session=False)
    db.query(UserRole).filter(UserRole.user_id == uid).delete(synchronize_session=False)
    db.delete(current_user)
    db.commit()
    
    return {"message": "Account deleted successfully"}
