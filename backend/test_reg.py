import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.models import Role, User
from app.api.auth import RegisterRequest, register

engine = create_engine("sqlite:///./test.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()
if not db.query(Role).first():
    db.add_all([
        Role(role_name="admin", role_description="Administrator"),
        Role(role_name="student", role_description="Student")
    ])
    db.commit()

req = RegisterRequest(
    username="testuser123",
    email="test@gmail.com",
    password="password123",
    full_name="Test User",
    role="student"
)

class DummyBackgroundTasks:
    def add_task(self, func, *args, **kwargs):
        print("Task added:", func, args)

bg = DummyBackgroundTasks()

async def run():
    try:
        res = await register(req, bg, db)
        print("Success:", res)
    except Exception as e:
        print("Error:", repr(e))

asyncio.run(run())
