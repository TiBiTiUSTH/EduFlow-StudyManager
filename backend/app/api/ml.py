from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

try:
    import joblib
    import pandas as pd
except ImportError:
    joblib = None
    pd = None

router = APIRouter(prefix="/stms/ml", tags=["ml"])

# Load Model Khởi tạo 
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../ml_engine/task_model.pkl')
model = None

try:
    if joblib and os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"[ML] Đã load thành công mô hình EduFlow Core ML: {MODEL_PATH}")
    else:
        print(f"[ML-WARNING] Không tìm thấy model tại {MODEL_PATH}. Sử dụng fallback.")
except Exception as e:
    print(f"[ML-ERROR] Lỗi khi load model: {e}")


# Định nghĩa Schema Input
class TaskPredictionRequest(BaseModel):
    subject_id: int        
    priority_level: int    
    time_of_day: int       
    user_historical_avg: float 


# API Endpoint Dự đoán 
@router.post("/predict-task-time")
async def predict_task_time(request: TaskPredictionRequest):
    try:
        if model is None:
            base = request.user_historical_avg * 0.7
            prio_weight = request.priority_level * 10
            time_weight = 5 if request.time_of_day == 2 else (-5 if request.time_of_day == 0 else 0)
            
            predicted_minutes = max(5, round(base + prio_weight + time_weight))
            recommended_pomodoros = max(1, round(predicted_minutes / 25))
            
            return {
                "predicted_minutes": predicted_minutes,
                "recommended_pomodoros": recommended_pomodoros,
                "message": f"Đang cập nhật. Ước tính: {predicted_minutes} phút."
            }
        
        input_data = pd.DataFrame([{
            'subject_id': request.subject_id,
            'priority_level': request.priority_level,
            'time_of_day': request.time_of_day,
            'user_historical_avg': request.user_historical_avg
        }])
        
        prediction = model.predict(input_data)[0]
        
        predicted_minutes = max(5, round(prediction))
        recommended_pomodoros = max(1, round(predicted_minutes / 25))
        
        return {
            "predicted_minutes": predicted_minutes,
            "recommended_pomodoros": recommended_pomodoros,
            "message": f"EduFlow AI phân tích lịch sử của bạn và dự đoán cần khoảng {predicted_minutes} phút ({recommended_pomodoros} Pomodoro)."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi chạy dự đoán: {str(e)}")
