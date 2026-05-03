from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt
import os
import json
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "yoursecretkeyhere_change_it_in_production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 43200))

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/stms/auth/login")

def is_maintenance_mode():
    config_file = "server_config.json"
    if os.path.exists(config_file):
        try:
            with open(config_file, "r") as f:
                config = json.load(f)
                return config.get("maintenance_mode", False)
        except Exception:
            return False
    return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_token if decoded_token["exp"] >= datetime.utcnow().timestamp() else None
    except:
        return None

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception

    if is_maintenance_mode():
        is_admin = any(r.role.role_name == "admin" for r in user.roles)
        if not is_admin:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Hệ thống đang trong chế độ bảo trì. Vui lòng quay lại sau."
            )

    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_user_ws(token: str, db: Session):
    """
    Cơ chế xác thực WebSocket. 
    WebSockets không hỗ trợ dễ dàng Authorization headers nguyên bản trong browser,
    nên ta truyền token trong URL hoặc query parameters.
    """
    payload = decode_access_token(token)
    if payload is None:
        return None
    username: str = payload.get("sub")
    if username is None:
        return None
    user = db.query(User).filter(User.username == username).first()
    
    if user and is_maintenance_mode():
        is_admin = any(r.role.role_name == "admin" for r in user.roles)
        if not is_admin:
            return None
            
    return user
