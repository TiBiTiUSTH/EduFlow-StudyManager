from pydantic import BaseModel, EmailStr

class User(BaseModel):
    email: EmailStr

try:
    u = User(email="test@example.com")
    print("Success")
except Exception as e:
    print(f"Failed: {e}")
