from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, subjects, tasks, schedules, notifications

app = FastAPI(title="EduFlow STMS API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(subjects.router)
app.include_router(tasks.router)
app.include_router(schedules.router)
app.include_router(notifications.router)

@app.get("/")
async def root():
    return {"message": "Welcome to EduFlow STMS API", "status": "running"}

@app.get("/stms/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
