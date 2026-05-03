import sys
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# Thêm backend vào path để import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models.models import Task, PomodoroSession

def get_time_of_day(hour):
    if 6 <= hour < 12:
        return 0
    elif 12 <= hour < 18:
        return 1
    else:
        return 2

def train_model():
    print("--- Khởi động EduFlow ML Training ---")
    db = SessionLocal()
    
    try:
        # Lấy các task đã hoàn thành
        tasks = db.query(Task).filter(
            Task.status.in_(['completed', 'done']),
            Task.actual_duration > 0,
            Task.subject_id.isnot(None)
        ).all()

        if len(tasks) < 10:
            print(f"[CẢNH BÁO] Hệ thống mới có {len(tasks)} dữ liệu thật.")
            print("[CẢNH BÁO] EduFlow AI cần ít nhất 10 Tasks đã hoàn thành để huấn luyện. Quá trình train tạm hoãn.")
            return

        print(f"Đã tìm thấy {len(tasks)} dữ liệu lịch sử thật. Đang xử lý...")

        data = []
        for t in tasks:
            prio = 2
            if t.priority == 'low': prio = 1
            elif t.priority == 'high': prio = 3
            
            dt = t.completion_date or t.updated_at or t.created_at
            time_of_day = get_time_of_day(dt.hour) if dt else 1
            user_tasks = db.query(Task).filter(
                Task.user_id == t.user_id,
                Task.status.in_(['completed', 'done']),
                Task.actual_duration > 0
            ).all()
            hist_avg = np.mean([ut.actual_duration for ut in user_tasks]) if user_tasks else 45

            data.append({
                'subject_id': t.subject_id,
                'priority_level': prio,
                'time_of_day': time_of_day,
                'user_historical_avg': hist_avg,
                'actual_duration_minutes': t.actual_duration
            })

        df = pd.DataFrame(data)

        print("Đang huấn luyện AI (Random Forest)...")
        X = df[['subject_id', 'priority_level', 'time_of_day', 'user_historical_avg']]
        y = df['actual_duration_minutes']

        test_size = 0.2 if len(df) >= 20 else 0.1
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)

        model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
        model.fit(X_train, y_train)

        if len(X_test) > 0:
            y_pred = model.predict(X_test)
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            print(f"\n--- Kết quả Đánh giá Model ---")
            print(f"Sai số trung bình (MAE): {mae:.2f} phút")
            print(f"Độ chính xác (R2): {r2:.4f}")

        # Lưu model
        os.makedirs(os.path.dirname(__file__), exist_ok=True)
        model_path = os.path.join(os.path.dirname(__file__), 'task_model.pkl')
        joblib.dump(model, model_path)
        print(f"\n[THÀNH CÔNG] Đã lưu Model AI tại: {model_path}")
        print("Sẵn sàng cho Server sử dụng!")

    except Exception as e:
        print(f"Lỗi khi huấn luyện model: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    train_model()
