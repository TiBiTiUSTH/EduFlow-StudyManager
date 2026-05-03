from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Date, Time, Numeric, Enum, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum

# Các Enum cho hệ thống
class RoleLevel(enum.IntEnum):
    ADMIN = 1
    PARENT = 2
    STUDENT = 3

class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class Priority(str, enum.Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class Status(str, enum.Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    OVERDUE = "overdue"

class FocusLevel(str, enum.Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    AVERAGE = "average"
    POOR = "poor"

class Mood(str, enum.Enum):
    ENERGETIC = "energetic"
    NORMAL = "normal"
    TIRED = "tired"
    STRESSED = "stressed"

# 1. Users & RBAC
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100))
    phone = Column(String(20))
    avatar_url = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    otp_code = Column(String(6), nullable=True)
    last_login = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    roles = relationship("UserRole", back_populates="user", cascade="all, delete-orphan", foreign_keys="[UserRole.user_id]")
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(50), unique=True, nullable=False)
    role_description = Column(Text)
    role_level = Column(Integer) # 1-Admin, 3-Học sinh
    created_at = Column(DateTime, server_default=func.now())

class UserRole(Base):
    __tablename__ = "user_roles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role_id = Column(Integer, ForeignKey("roles.id"))
    assigned_at = Column(DateTime, server_default=func.now())
    assigned_by = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="roles", foreign_keys=[user_id])
    assigner = relationship("User", foreign_keys=[assigned_by])
    role = relationship("Role")

# 2. Profiles & Relationships
class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    school_name = Column(String(100))
    grade_level = Column(String(20))
    student_code = Column(String(50))
    date_of_birth = Column(Date)
    gender = Column(String(20)) # nam, nữ, khác
    address = Column(Text)
    study_goal = Column(Text)
    daily_study_target = Column(Integer) # phút
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="profile")



# 3. Learning Data
class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_name = Column(String(100), nullable=False)
    subject_code = Column(String(20))
    color_code = Column(String(7))
    description = Column(Text)
    target_hours_per_week = Column(Integer)
    priority = Column(String(20), default="medium")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    tasks = relationship("Task", back_populates="subject", cascade="all, delete-orphan")
    schedules = relationship("Schedule", back_populates="subject", cascade="all, delete-orphan")
    user = relationship("User", foreign_keys=[user_id])

class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    custom_subject = Column(String(100))
    is_recurring = Column(Boolean, default=False)
    recurrence_pattern = Column(String(50)) # ngày, tuần, tháng
    recurrence_days = Column(String(50)) # chuỗi JSON
    recurrence_end_date = Column(Date)
    status = Column(String(20), default="scheduled")
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    subject = relationship("Subject", back_populates="schedules")
    user = relationship("User", foreign_keys=[user_id])
    creator = relationship("User", foreign_keys=[created_by])

class TaskGroup(Base):
    __tablename__ = "task_groups"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100), nullable=False)
    color = Column(String(20), default="#6366f1")
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", foreign_keys=[user_id])
    tasks = relationship("Task", back_populates="group")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    group_id = Column(Integer, ForeignKey("task_groups.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    task_type = Column(String(20), default="assignment")
    priority = Column(String(20), default="medium")
    difficulty = Column(String(20))
    due_date = Column(DateTime)
    estimated_duration = Column(Integer) # phút
    actual_duration = Column(Integer) # phút
    status = Column(String(20), default="pending")
    completion_date = Column(DateTime)
    completion_percentage = Column(Integer, default=0)
    score = Column(Numeric(5, 2))
    max_score = Column(Numeric(5, 2))
    
    # Phân tách task bằng AI
    parent_task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    ai_suggested = Column(Boolean, default=False)
    ai_recommendation = Column(Text)
    attachments = Column(Text) # chuỗi JSON
    
    # Lặp lại ngắt quãng (Thuật toán SM-2)
    is_reviewable = Column(Boolean, default=False)
    sm2_interval = Column(Integer, default=0) # Số ngày đến lần ôn tập
    sm2_repetitions = Column(Integer, default=0) # Số lần ôn đúng liên tiếp
    sm2_easiness_factor = Column(Numeric(5, 2), default=2.5) # Hệ số dễ (E-Factor)
    next_review_date = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    subject = relationship("Subject", back_populates="tasks")
    group = relationship("TaskGroup", back_populates="tasks")
    user = relationship("User", foreign_keys=[user_id])
    creator = relationship("User", foreign_keys=[created_by])
    
    # Quan hệ vòng lặp cho Task (Cha-Con)
    subtasks = relationship("Task", back_populates="parent", cascade="all, delete-orphan")
    parent = relationship("Task", back_populates="subtasks", remote_side=[id])

class UserPreference(Base):
    __tablename__ = "user_preferences"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    theme = Column(String(20), default="light")
    language = Column(String(10), default="vi")
    timezone = Column(String(50), default="Asia/Ho_Chi_Minh")
    notification_enabled = Column(Boolean, default=True)
    email_notification = Column(Boolean, default=True)
    push_notification = Column(Boolean, default=True)
    study_reminder_time = Column(Time)
    pomodoro_work_duration = Column(Integer, default=25)
    pomodoro_break_duration = Column(Integer, default=5)
    ai_assistance_level = Column(String(20), default="moderate")
    show_ai_suggestions = Column(Boolean, default=True)
    auto_schedule_optimization = Column(Boolean, default=False)
    privacy_mode = Column(String(20), default="private")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="preferences")

# 4. Study & Sessions
class StudySession(Base):
    __tablename__ = "study_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    schedule_id = Column(Integer, ForeignKey("schedules.id"), nullable=True)
    session_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time)
    duration_minutes = Column(Integer)
    study_note = Column(Text)
    focus_level = Column(String(20)) # xuất sắc, tốt, trung bình, kém
    mood = Column(String(20)) # năng lượng, bình thường, mệt, căng thẳng
    environment = Column(String(100))
    is_completed = Column(Boolean, default=False)
    ai_analysis = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", foreign_keys=[user_id])

class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    session_date = Column(DateTime, nullable=False)
    work_duration = Column(Integer, default=25)
    break_duration = Column(Integer, default=5)
    completed_pomodoros = Column(Integer, default=0)
    total_focus_time = Column(Integer)
    interruptions = Column(Integer, default=0)
    interruption_reasons = Column(Text) # chuỗi JSON
    effectiveness_rating = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", foreign_keys=[user_id])

# 5. Reports & Statistics
class StudyReport(Base):
    __tablename__ = "study_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    report_date = Column(Date, nullable=False)
    report_type = Column(String(20), default="daily") # ngày, tuần, tháng
    total_study_time = Column(Integer)
    total_tasks_completed = Column(Integer)
    total_tasks_pending = Column(Integer)
    productivity_score = Column(Numeric(5, 2))
    focus_score = Column(Numeric(5, 2))
    consistency_score = Column(Numeric(5, 2))
    improvement_percentage = Column(Numeric(5, 2))
    ai_insights = Column(Text)
    ai_recommendations = Column(Text)
    student_notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", foreign_keys=[user_id])

class SubjectStatistic(Base):
    __tablename__ = "subject_statistics"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    period_start_date = Column(Date, nullable=False)
    period_end_date = Column(Date, nullable=False)
    period_type = Column(String(20), default="week")
    total_study_time = Column(Integer)
    sessions_count = Column(Integer)
    average_focus_level = Column(Numeric(3, 2))
    average_mood = Column(String(20))
    tasks_completed = Column(Integer)
    tasks_pending = Column(Integer)
    average_score = Column(Numeric(5, 2))
    target_achieved = Column(Boolean, default=False)
    strength_areas = Column(Text)
    weakness_areas = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", foreign_keys=[user_id])

# 6. Goals & Achievements
class Goal(Base):
    __tablename__ = "goals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    goal_title = Column(String(200), nullable=False)
    goal_description = Column(Text)
    goal_type = Column(String(20), default="weekly")
    metric_type = Column(String(20), default="study_time")
    target_value = Column(Integer)
    current_value = Column(Integer, default=0)
    unit = Column(String(20))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(String(20), default="active")
    achievement_date = Column(DateTime)
    is_ai_suggested = Column(Boolean, default=False)
    ai_rationale = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", foreign_keys=[user_id])
    creator = relationship("User", foreign_keys=[created_by])

class GoalProgressLog(Base):
    __tablename__ = "goal_progress_logs"
    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id"))
    log_date = Column(Date, nullable=False)
    progress_value = Column(Integer, nullable=False)
    percentage_complete = Column(Numeric(5, 2))
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    achievement_name = Column(String(100), unique=True, nullable=False)
    achievement_description = Column(Text)
    badge_icon = Column(String(255))
    badge_color = Column(String(7))
    achievement_type = Column(String(50))
    achievement_category = Column(String(20), default="bronze")
    requirement_value = Column(Integer)
    requirement_description = Column(Text)
    points = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_id = Column(Integer, ForeignKey("achievements.id"))
    achieved_at = Column(DateTime, server_default=func.now())
    progress_data = Column(Text) # chuỗi JSON

    user = relationship("User", foreign_keys=[user_id])

# 7. Communication & Tools
class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    title = Column(String(200), nullable=False)
    content = Column(Text)
    note_type = Column(String(20), default="lecture")
    tags = Column(String(255))
    is_favorite = Column(Boolean, default=False)
    attachments = Column(Text) # chuỗi JSON
    ai_enhanced = Column(Boolean, default=False)
    ai_summary = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", foreign_keys=[user_id])

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    notification_type = Column(String(50))
    title = Column(String(200), nullable=False)
    message = Column(Text)
    link_url = Column(String(255))
    priority = Column(String(20), default="medium")
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", foreign_keys=[user_id])
    sender = relationship("User", foreign_keys=[sender_id])



# 8. System & AI Interactions
class AIInteraction(Base):
    __tablename__ = "ai_interactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    interaction_type = Column(String(50))
    user_query = Column(Text)
    ai_response = Column(Text)
    context_data = Column(Text) # chuỗi JSON
    satisfaction_rating = Column(Integer)
    was_helpful = Column(Boolean)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", foreign_keys=[user_id])

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action_type = Column(String(50))
    entity_type = Column(String(50))
    entity_id = Column(Integer)
    description = Column(Text)
    ip_address = Column(String(45))
    user_agent = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", foreign_keys=[user_id])

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    feedback_type = Column(String(20))
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    rating = Column(Integer)
    screenshot_url = Column(String(255))
    status = Column(String(20), default="new")
    admin_response = Column(Text)
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolved_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", foreign_keys=[user_id])
    resolver = relationship("User", foreign_keys=[resolved_by])

class SystemSetting(Base):
    __tablename__ = "system_settings"
    id = Column(Integer, primary_key=True, index=True)
    setting_key = Column(String(100), unique=True, nullable=False)
    setting_value = Column(Text)
    setting_type = Column(String(50))
    description = Column(Text)
    is_public = Column(Boolean, default=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    updater = relationship("User", foreign_keys=[updated_by])

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String(20), nullable=False)  # 'người dùng' hoặc 'ai'
    message = Column(Text, nullable=False)
    file_name = Column(String(255), nullable=True)
    thread_id = Column(String(100), default="default")
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", foreign_keys=[user_id])

class TaskChatHistory(Base):
    __tablename__ = "task_chat_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"))
    chat_type = Column(String(20), nullable=False)  
    role = Column(String(20), nullable=False)  
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", foreign_keys=[user_id])
    task = relationship("Task")

# 9. Subject Community & Buddy System


class SubjectChannel(Base):
    """Kênh chat theo môn học - hỗ trợ Công khai & Riêng tư"""
    __tablename__ = "subject_channels"
    id = Column(Integer, primary_key=True, index=True)
    subject_name = Column(String(100), nullable=False)
    grade_level = Column(String(20))
    description = Column(Text)
    icon = Column(String(10))
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_private = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    member_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

    creator = relationship("User", foreign_keys=[creator_id])
    messages = relationship("SubjectChannelMessage", back_populates="channel", cascade="all, delete-orphan")
    members = relationship("SubjectChannelMember", back_populates="channel", cascade="all, delete-orphan")
    join_requests = relationship("ChannelJoinRequest", back_populates="channel", cascade="all, delete-orphan")

class SubjectChannelMember(Base):
    """Thành viên trong kênh môn học"""
    __tablename__ = "subject_channel_members"
    id = Column(Integer, primary_key=True, index=True)
    channel_id = Column(Integer, ForeignKey("subject_channels.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    joined_at = Column(DateTime, server_default=func.now())

    channel = relationship("SubjectChannel", back_populates="members")
    user = relationship("User", foreign_keys=[user_id])

class SubjectChannelMessage(Base):
    """Tin nhắn trong kênh môn học"""
    __tablename__ = "subject_channel_messages"
    id = Column(Integer, primary_key=True, index=True)
    channel_id = Column(Integer, ForeignKey("subject_channels.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text, nullable=False)
    message_type = Column(String(20), default="text")
    created_at = Column(DateTime, server_default=func.now())

    channel = relationship("SubjectChannel", back_populates="messages")
    user = relationship("User", foreign_keys=[user_id])

class ChannelJoinRequest(Base):
    """Yêu cầu xin vào nhóm riêng tư"""
    __tablename__ = "channel_join_requests"
    id = Column(Integer, primary_key=True, index=True)
    channel_id = Column(Integer, ForeignKey("subject_channels.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, server_default=func.now())

    channel = relationship("SubjectChannel", back_populates="join_requests")
    user = relationship("User", foreign_keys=[user_id])

class BuddyRequest(Base):
    """Lời mời kết bạn học"""
    __tablename__ = "buddy_requests"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text)
    status = Column(String(20), default="pending")
    responded_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])

class BuddyRelationship(Base):
    """Quan hệ bạn học (sau khi accept request)"""
    __tablename__ = "buddy_relationships"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    buddy_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", foreign_keys=[user_id])
    buddy = relationship("User", foreign_keys=[buddy_id])

class DirectMessage(Base):
    """Tin nhắn riêng 1-1 giữa buddy"""
    __tablename__ = "direct_messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    message_type = Column(String(20), default="text")
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])

# 10.Phòng học

class StudyRoom(Base):
    """Phòng học nhóm - tạo và chia sẻ qua mã phòng"""
    __tablename__ = "study_rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_code = Column(String(10), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    subject_name = Column(String(100))
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    max_participants = Column(Integer, default=10)
    is_public = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    host = relationship("User", foreign_keys=[host_id])
    members = relationship("StudyRoomMember", back_populates="room", cascade="all, delete-orphan")
    messages = relationship("StudyRoomMessage", back_populates="room", cascade="all, delete-orphan")

class StudyRoomMember(Base):
    """Thành viên trong phòng học"""
    __tablename__ = "study_room_members"
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("study_rooms.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String(20), default="member")
    is_online = Column(Boolean, default=False)
    joined_at = Column(DateTime, server_default=func.now())

    room = relationship("StudyRoom", back_populates="members")
    user = relationship("User", foreign_keys=[user_id])

class StudyRoomMessage(Base):
    """Tin nhắn trong phòng học"""
    __tablename__ = "study_room_messages"
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("study_rooms.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text, nullable=False)
    message_type = Column(String(20), default="text")
    created_at = Column(DateTime, server_default=func.now())

    room = relationship("StudyRoom", back_populates="messages")
    user = relationship("User", foreign_keys=[user_id])

# 11. Resource Library

class Resource(Base):
    """Tài liệu chia sẻ (PDF, DOC, PPTX...)"""
    __tablename__ = "resources"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    subject_name = Column(String(100))
    grade_level = Column(String(20))
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_type = Column(String(50))
    file_size = Column(Integer)
    download_count = Column(Integer, default=0)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", foreign_keys=[user_id])
