from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/stms/ml", tags=["ml"])


class TaskPredictionRequest(BaseModel):
    subject_id: int
    priority_level: int
    time_of_day: int
    user_historical_avg: float


@router.post("/predict-task-time")
async def predict_task_time(request: TaskPredictionRequest):
    """Ước tính thời gian hoàn thành nhiệm vụ dựa trên các yếu tố"""
    try:
        base = request.user_historical_avg * 0.7
        prio_weight = request.priority_level * 10
        time_weight = 5 if request.time_of_day == 2 else (-5 if request.time_of_day == 0 else 0)

        predicted_minutes = max(5, round(base + prio_weight + time_weight))
        recommended_pomodoros = max(1, round(predicted_minutes / 25))

        return {
            "predicted_minutes": predicted_minutes,
            "recommended_pomodoros": recommended_pomodoros,
            "message": f"EduFlow AI dự đoán cần khoảng {predicted_minutes} phút ({recommended_pomodoros} Pomodoro)."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi dự đoán: {str(e)}")
