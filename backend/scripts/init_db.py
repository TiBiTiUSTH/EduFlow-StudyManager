import sys
import os

# Add the parent directory to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.models import User, Role, UserRole, RoleLevel
from app.utils.security import get_password_hash

def init_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # 1. Create Roles if they don't exist
    roles_data = [
        {"name": "admin", "level": RoleLevel.ADMIN, "desc": "System Administrator"},
        {"name": "parent", "level": RoleLevel.PARENT, "desc": "Parent Role"},
        {"name": "student", "level": RoleLevel.STUDENT, "desc": "Student Role"},
    ]
    
    roles = {}
    for r in roles_data:
        role = db.query(Role).filter(Role.role_name == r["name"]).first()
        if not role:
            role = Role(role_name=r["name"], role_level=r["level"], role_description=r["desc"])
            db.add(role)
            db.commit()
            db.refresh(role)
            print(f"Created role: {r['name']}")
        roles[r["name"]] = role

    # 2. Create Default Admin if it doesn't exist
    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        hashed_password = get_password_hash("123")
        admin_user = User(
            username="admin",
            email="admin@stms.com",
            password_hash=hashed_password,
            full_name="System Administrator",
            is_active=True,
            is_verified=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        # Link Admin role
        admin_role_link = UserRole(user_id=admin_user.id, role_id=roles["admin"].id)
        db.add(admin_role_link)
        db.commit()
        print("Created default admin user: admin / 123")
    else:
        print("Admin user already exists.")

    db.close()
    print("Database initialization complete.")

if __name__ == "__main__":
    init_db()
