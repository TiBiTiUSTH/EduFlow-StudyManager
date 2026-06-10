from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .ai import call_ai_async
import json

router = APIRouter(prefix="/stms/ml", tags=["ml"])


class TaskPredictionRequest(BaseModel):
    subject_id: int
    priority_level: int
    time_of_day: int
    user_historical_avg: float


@router.post("/predict-task-time")
async def predict_task_time(request: TaskPredictionRequest):
    priority_text = "cao" if request.priority_level == 3 else "trung bình" if request.priority_level == 2 else "thấp"
    time_text = "tối" if request.time_of_day == 2 else "chiều" if request.time_of_day == 1 else "sáng"

    prompt = f"""Bạn là AI ước tính thời gian học tập. Dựa vào thông tin sau, hãy ước tính số phút cần thiết:
- Độ ưu tiên: {priority_text}
- Thời điểm trong ngày: {time_text}
- Thời gian trung bình trước đây của người dùng: {request.user_historical_avg} phút

Trả về CHỈ một JSON object duy nhất, KHÔNG có markdown, KHÔNG có giải thích:
{{"predicted_minutes": 45, "recommended_pomodoros": 2, "message": "Ước tính: 45 phút (2 Pomodoro)."}}"""

    try:
        reply = await call_ai_async(prompt, max_tokens=150)

        clean = reply.strip()
        if clean.startswith("```"):
            clean = clean.split("\n", 1)[1] if "\n" in clean else clean[3:]
        if clean.endswith("```"):
            clean = clean[:-3]
        # Find JSON in response
        start = clean.find("{")
        end = clean.rfind("}") + 1
        if start >= 0 and end > start:
            clean = clean[start:end]

        data = json.loads(clean.strip())
        return data
    except Exception as e:
        print(f"[ML-AI] Fallback: {e}")
        # Fallback tính toán đơn giản
        base = request.user_historical_avg * 0.7
        prio_weight = request.priority_level * 10
        time_weight = 5 if request.time_of_day == 2 else (-5 if request.time_of_day == 0 else 0)
        predicted_minutes = max(5, round(base + prio_weight + time_weight))
        recommended_pomodoros = max(1, round(predicted_minutes / 25))
        return {
            "predicted_minutes": predicted_minutes,
            "recommended_pomodoros": recommended_pomodoros,
            "message": f"Ước tính: {predicted_minutes} phút ({recommended_pomodoros} Pomodoro)."
        }
