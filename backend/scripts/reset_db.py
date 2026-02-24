import sys
import os

# Add the parent directory to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.models import (
    User, Role, UserRole, UserProfile, UserPreference,
    Subject, Schedule, Task, StudySession, PomodoroSession,
    StudyReport, SubjectStatistic, Goal, GoalProgressLog,
    Achievement, UserAchievement, Note, Notification,
    ParentMessage, AIInteraction, ActivityLog, Feedback
)
from app.utils.security import get_password_hash

def reset_db():
    db = SessionLocal()
    print("Starting Safe Reset Protocol...")

    try:
        # 1. Clear individual study data (Student/Parent data)
        # Note: Order matters for foreign key constraints if not using CASCADE in DB
        db.query(GoalProgressLog).delete()
        db.query(Goal).delete()
        db.query(PomodoroSession).delete()
        db.query(SubjectStatistic).delete()
        db.query(StudyReport).delete()
        db.query(StudySession).delete()
        db.query(Task).delete()
        db.query(Schedule).delete()
        db.query(Note).delete()
        db.query(Subject).delete()
        db.query(Achievement).delete() # In standard reset, we might keep achievements, but per outline we can reset user progress
        db.query(UserAchievement).delete()
        db.query(ParentMessage).delete()
        db.query(AIInteraction).delete()
        db.query(ActivityLog).delete()
        db.query(Notification).delete()
        db.query(Feedback).delete()
        
        # 2. Clear Users (Except Admin)
        admin_user = db.query(User).filter(User.username == "admin").first()
        admin_id = admin_user.id if admin_user else None
        
        if admin_id:
            db.query(UserProfile).filter(UserProfile.user_id != admin_id).delete()
            db.query(UserPreference).filter(UserPreference.user_id != admin_id).delete()
            db.query(UserRole).filter(UserRole.user_id != admin_id).delete()
            db.query(User).filter(User.id != admin_id).delete()
            
            # Reset Admin password
            admin_user.password_hash = get_password_hash("123")
            admin_user.is_verified = True
            print("Reset Admin password to: 123")
        else:
            print("Warning: Admin user not found. Please run init_db.py first.")

        db.commit()
        print("Safe Reset Protocol completed successfully.")
        print("Note: Static files in uploads/ were preserved.")

    except Exception as e:
        db.rollback()
        print(f"Error during reset: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_db()
