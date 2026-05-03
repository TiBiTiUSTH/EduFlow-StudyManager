# EduFlow - Study Time Management System

A comprehensive web-based study time management system for students built with **FastAPI**, **React**, and **PostgreSQL**.

## 🚀 Features

- ✅ **Role-Based Access Control** - Admin, Parent, Student dashboards
- ✅ **Task Management** - Create, track, and prioritize study tasks
- ✅ **Study Schedules** - Plan weekly study sessions
- ✅ **Progress Tracking** - Monitor study progress and completion rates
- ✅ **Pomodoro Timer** - Built-in focus timer
- ✅ **Notifications System** - Real-time notifications
- ✅ **OTP Verification** - Secure user registration
- ✅ **PostgreSQL Database** - Production-ready database
- ✅ **Docker Support** - Easy deployment with docker-compose

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Production database (or SQLite for local dev)
- **JWT Authentication** - Secure token-based auth
- **Bcrypt** - Secure password hashing

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Vite** - Fast build tool
- **Axios** - HTTP client

### DevOps
- **Docker & Docker Compose** - Containerization
- **PostgreSQL 15** - Database container
- **Postman** - API testing

## 📋 Prerequisites

Make sure you have the following installed:
- **Docker Desktop** ✅
- **PostgreSQL** (for non-Docker development) ✅
- **Node.js 18+**
- **Python 3.11+**

## 🚀 Quick Start with Docker

The easiest way to run the entire application:

```bash
# 1. Clone the repository
cd EduFlow-StudyManager

# 2. Create environment file
cp backend/.env.example backend/.env
# Edit backend/.env and set your SECRET_KEY

# 3. Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d

# 4. Initialize the database
docker-compose exec backend python backend/scripts/init_db.py

# 5. Access the application
# Frontend: http://localhost:8080
#  Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `123`

## 💻 Manual Setup (Without Docker)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup PostgreSQL database
psql -U postgres
CREATE DATABASE eduflow_db;
CREATE USER eduflow_user WITH PASSWORD 'eduflow_pass';
GRANT ALL PRIVILEGES ON DATABASE eduflow_db TO eduflow_user;
\q

# Create .env file
cp .env.example .env
# Edit .env and set DATABASE_URL to PostgreSQL

# Initialize database
python scripts/init_db.py

# Run backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev -- --port 8080 --host 127.0.0.1
```

## 🧪 API Testing with Postman

1. **Import Collection**
   - Open Postman
   - Import `docs/EduFlow.postman_collection.json`
   - Import `docs/EduFlow.postman_environment.json`

2. **Set Environment**
   - Select "EduFlow Environment"
   - Verify `base_url` is correct

3. **Test Authentication**
   - Run "Login" request
   - Token will be automatically set in environment

4. **Test Other Endpoints**
   - All requests use Bearer token authentication
   - Test CRUD operations for Tasks, Schedules, Subjects

## 📚 Documentation

- [Docker Setup Guide](docs/DOCKER.md) - Detailed Docker instructions
- [API Documentation](docs/API.md) - Complete API reference
- [Postman Collection](docs/EduFlow.postman_collection.json) - API testing

## 🔑 Environment Variables

```env
# Database
DATABASE_URL=postgresql://eduflow_user:eduflow_pass@postgres:5432/eduflow_db

# JWT
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

## 📁 Project Structure

```
EduFlow-StudyManager/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── models/       # Database models
│   │   ├── utils/        # Utilities (auth, security)
│   │   ├── database.py   # Database config
│   │   └── main.py       # FastAPI app
│   ├── scripts/
│   │   └── init_db.py    # Database initialization
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   ├── pages/            # React pages
│   ├── components/       # React components
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── EduFlow.postman_collection.json
│   ├── EduFlow.postman_environment.json
│   ├── DOCKER.md
│   └── API.md
├── docker-compose.yml
└── README.md
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild containers
docker-compose build

# Access backend shell
docker-compose exec backend bash

# Access PostgreSQL
docker-compose exec postgres psql -U eduflow_user -d eduflow_db
```

## 🔧 Development

### Backend Development
```bash
# Install new package
pip install package_name
pip freeze > requirements.txt

# Run migrations (if using Alembic)
alembic upgrade head
```

### Frontend Development
```bash
# Install new package
npm install package_name

# Build for production
npm run build
```

## 🎯 Features by Role

### Admin
- User management
- System configuration
- View all tasks and schedules

### Parent
- Monitor student progress
- View student tasks
- Receive notifications

### Student
- Create and manage tasks
- Schedule study sessions
- Use Pomodoro timer
- Track progress and completion rates

## 🔒 Security

- JWT token authentication
- Password hashing with Bcrypt
- OTP verification for new users
- Role-based access control
- Bandit security scanning

## 📝 License

This project is for educational purposes.

## 👨‍💻 Author

EduFlow Study Manager - 2026
