import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "toxic_model.pkl")

from .ai_filter import clean_text

def train_and_save_model():
    print("Dang tai du lieu tu dataset.csv...")
    if not os.path.exists(DATA_PATH):
        print(f"Khong tim thay file: {DATA_PATH}")
        return

    try:
        df = pd.read_csv(DATA_PATH)
        print(f"Da tai {len(df)} cau du lieu.")
    except Exception as e:
        print(f"Loi khi doc file CSV: {e}")
        return

    # Tiền xử lý dữ liệu
    df['clean_text'] = df['text'].apply(clean_text)

    # TF-IDF + Logistic Regression
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(analyzer='char_wb', ngram_range=(2, 5), max_features=10000)),
        ('clf', LogisticRegression(C=1.0, class_weight='balanced', random_state=42))
    ])

    print("Dang huan luyen mo hinh AI...")
    X = df['clean_text']
    y = df['label']
    
    pipeline.fit(X, y)
    
    # Tính toán độ chính xác
    accuracy = pipeline.score(X, y)
    print(f"Training finished! Accuracy on training set: {accuracy * 100:.2f}%")

    # Lưu mô hình
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Model saved successfully at: {MODEL_PATH}")

if __name__ == "__main__":
    train_and_save_model()
