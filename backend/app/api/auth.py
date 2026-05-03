from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.models import User, Role, UserRole
from ..utils.security import verify_password, get_password_hash
from ..utils.auth import create_access_token
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import random
import string

router = APIRouter(prefix="/stms/auth", tags=["auth"])

class Token(BaseModel):
    access_token: str
    token_type: str
    roles: List[str]
    username: str

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    role: str

class VerifyOTPRequest(BaseModel):
    username: str
    otp_code: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str

from sqlalchemy import or_

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(
        or_(User.username == form_data.username, User.email == form_data.username)
    ).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Lấy danh sách roles của user
    user_roles = [ur.role.role_name for ur in user.roles]
    
    # Admin không cần xác minh OTP
    if not user.is_verified and 'admin' not in user_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not verified. Please verify your OTP.",
        )
    
    access_token = create_access_token(
        data={"sub": user.username, "id": user.id, "roles": user_roles}
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "roles": user_roles,
        "username": user.username
    }

@router.post("/register")
async def register(req: RegisterRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Kiểm tra user tồn tại
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    # Lấy role
    role = db.query(Role).filter(Role.role_name == req.role).first()
    if not role or req.role not in ['student']:
        raise HTTPException(status_code=400, detail="Invalid role selection")

    import os
    # Tạo OTP (Dùng 123456 cho demo nếu chưa cài email)
    if os.getenv("SMTP_HOST"):
        otp = ''.join(random.choices(string.digits, k=6))
    else:
        otp = "123456"
    
    # Tạo User
    new_user = User(
        username=req.username,
        email=req.email,
        password_hash=get_password_hash(req.password),
        full_name=req.full_name,
        otp_code=otp,
        is_verified=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Gán Role
    user_role = UserRole(user_id=new_user.id, role_id=role.id)
    db.add(user_role)
    db.commit()

    # Gọi Background Task để gửi OTP qua FastAPI
    try:
        from ..worker import send_otp_email
        background_tasks.add_task(send_otp_email, req.email, otp)
        print(f"DEBUG: Added OTP task to FastAPI Background tasks for {req.username}: {otp}")
    except Exception as e:
        print(f"WARNING: Task add failed: {e}")

    return {"message": "Registration successful. Please verify OTP.", "username": req.username}

@router.post("/verify-otp")
async def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.otp_code == req.otp_code:
        user.is_verified = True
        user.otp_code = None
        db.commit()
        return {"message": "OTP verified successfully. You can now login."}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP code")

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email không tồn tại trong hệ thống")
    
    import os
    # Tạo OTP
    if os.getenv("SMTP_HOST"):
        otp = ''.join(random.choices(string.digits, k=6))
    else:
        otp = "123456"
    user.otp_code = otp
    db.commit()
    
    # Gửi OTP
    try:
        from ..worker import send_otp_email
        background_tasks.add_task(send_otp_email, user.email, otp)
    except Exception as e:
        print(f"WARNING: failed to send OTP: {e}")
        
    return {"message": "Mã xác thực đã được gửi đến email của bạn"}

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email không tồn tại")
        
    if not user.otp_code or user.otp_code != req.otp_code:
        raise HTTPException(status_code=400, detail="Mã OTP không đúng hoặc đã hết hạn")
        
    user.password_hash = get_password_hash(req.new_password)
    user.otp_code = None  # Xóa OTP
    # Tự động verify user luôn nếu họ chưa verify
    if not user.is_verified:
        user.is_verified = True
    db.commit()
    
    return {"message": "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay."}
