from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
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
    role: str # 'student' or 'parent'

class VerifyOTPRequest(BaseModel):
    username: str
    otp_code: str

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not verified. Please verify your OTP.",
        )
    
    # Lấy danh sách roles của user
    user_roles = [ur.role.role_name for ur in user.roles]
    
    access_token = create_access_token(
        data={"sub": user.username, "id": user.id, "roles": user_roles}
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer", # nosec
        "roles": user_roles,
        "username": user.username
    }

@router.post("/register")
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    # Get role
    role = db.query(Role).filter(Role.role_name == req.role).first()
    if not role or req.role not in ['student', 'parent']:
        raise HTTPException(status_code=400, detail="Invalid role selection")

    # Create OTP
    otp = ''.join(random.choices(string.digits, k=6))
    
    # Create User
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

    # Assign Role
    user_role = UserRole(user_id=new_user.id, role_id=role.id)
    db.add(user_role)
    db.commit()

    print(f"DEBUG: Generated OTP for {req.username}: {otp}")
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
