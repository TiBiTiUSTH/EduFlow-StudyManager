import os
import re
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "toxic_model.pkl")

# Biến toàn cục lưu trữ mô hình
_ai_pipeline = None
_last_model_mtime = 0

# Danh sách từ cấm
TOXIC_KEYWORDS = [
    "đm", "đcm", "dcm", "dkm", "đkm", "dcmm", "đcmm", "đmm", "dmm",
    "địt", "dit", "đụ", "đjt", "djt",
    "địt mẹ", "dit me", "đụ mẹ", "đụ má", "địt cụ", "đĩ mẹ",
    "con mẹ mày", "mẹ cha mày", "mả cha mày",
    "lồn", "lol", "loz", "lìn",
    "cặc", "cặk", "cac", "buồi", "buoi",
    "vl", "vll", "vcl", "vcll", "vkl", "vklm", "vãi lồn", "vãi lol", "vãi lìn", "vãi loz",
    "cc", "cl", "clm", "clmm", "clgt",
    "đĩ", "phò", "điếm", "đĩ thõa", "phò phạch", "đĩ chó", "đĩ điếm", "con đĩ", "con phò",
    "chó đẻ", "súc vật", "súc sinh", "súc sanh",
    "ngu lồn", "hãm lồn", "hãm lol", "mặt lồn", "mặt cặc", "nứng lồn",
    "xàm lồn", "xạo lồn", "xàm lol",
    "óc chó", "óc cặc", "óc bã đậu", "ngáo chó",
    "thằng chó", "con chó", "đồ chó",
    "cút mẹ", "biến đi", "câm mồm", "im mồm",
    "ăn cứt", "ăn cc", "ăn l",
    "ngu như bò", "ngu như chó", "ngu si", "ngu học", "ngu thế", "ngu vcl", "ngu vkl",
    "mất dạy", "vô học", "bố láo",
    "bố sư", "tiên sư", "tổ sư",
    "chết cụ", "chết mẹ", "chết cha",
    "nhảy lầu", "đi chết",
    "cái đéo", "đéo", "đếch",
    "thằng điên", "thằng ranh",
    "cái qq", "cái đb", "đầu buồi", "đầu b",
    "wtf", "stfu", "fuck", "fck", "fuk", "shit", "bitch", "dick", "ass",
    "d.m", "d m", "đ.m", "đ m", "d.c.m", "v.l", "v l", "c.c", "c c",
    "đ!t", "d!t", "đ1t", "d1t", "l0n", "l0l", "c4c", "bu0i",
    "deo", "dech", "deo biet", "deo hieu",
    "dit", "dit me", "dit cu",
    "lon", "lon nay",
    "ngu nhu bo", "ngu nhu cho",
    "mat day", "vo hoc", "suc vat",
    "bo su", "tien su",
    "chet cu", "chet me", "chet cha",
]

SHORT_TOXIC = {"dm", "đm", "cl", "cc", "vl", "vc", "xl", "đụ"}

TOXIC_KEYWORDS.sort(key=len, reverse=True)

_toxic_patterns = []
for kw in TOXIC_KEYWORDS:
    escaped = re.escape(kw)
    flexible = r'[\s\.\-_*]{0,2}'.join(escaped)
    _toxic_patterns.append(re.compile(flexible, re.IGNORECASE))

_short_patterns = []
for kw in SHORT_TOXIC:
    _short_patterns.append(re.compile(r'(?:^|\s|[,\.!?])' + re.escape(kw) + r'(?:\s|[,\.!?]|$)', re.IGNORECASE))


def keyword_check(text: str) -> bool:
    """Lớp 1: Quét blacklist từ cấm — bắt được cả khi chèn vào giữa câu dài"""
    text_lower = text.lower()
    text_lower = decode_teencode(text_lower) # Giải mã teencode 

    # 
    text_normalized = re.sub(r'(?<=\w)[\.\-_*](?=\w)', '', text_lower)
    
    for pattern in _short_patterns:
        if pattern.search(text_lower) or pattern.search(text_normalized):
            return True
    
    # Check full keyword list
    for pattern in _toxic_patterns:
        if pattern.search(text_lower) or pattern.search(text_normalized):
            return True
    return False


def load_model():
    """Tải mô hình vào bộ nhớ và tự động reload nếu file .pkl thay đổi"""
    global _ai_pipeline, _last_model_mtime
    if os.path.exists(MODEL_PATH):
        current_mtime = os.path.getmtime(MODEL_PATH)
        if _ai_pipeline is None or current_mtime > _last_model_mtime:
            try:
                _ai_pipeline = joblib.load(MODEL_PATH)
                _last_model_mtime = current_mtime
                print("[AI Filter] Model loaded successfully!")
            except Exception as e:
                print(f"[AI Filter] Error loading model: {e}")
    else:
        print("[AI Filter] toxic_model.pkl not found. Run train_model.py first.")

# Mapping ký tự lách luật
TEENCODE_MAP = {
    '0': 'o',
    '1': 'i',
    '3': 'e',
    '4': 'a',
    '@': 'a',
    '!': 'i',
    '[': 'c',
    '$': 's',
    'k': 'c',
    'q': 'c'
}

def decode_teencode(text: str) -> str:
    """Dịch các ký tự lách luật về chữ cái thường"""
    res = text
    for k, v in TEENCODE_MAP.items():
        res = res.replace(k, v)
    return res

def clean_text(text):
    """Làm sạch văn bản (Giống hệt lúc huấn luyện)"""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = decode_teencode(text)
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def is_toxic_message(message: str) -> bool:
    """
    Hàm kiểm duyệt tin nhắn — 2 lớp bảo vệ:
    
    Lớp 1: Keyword blacklist — quét trực tiếp từ cấm (nhanh, chính xác 100%)
            Bắt được cả khi chèn từ bậy vào giữa câu bình thường dài
    
    Lớp 2: AI Model (ML) — dùng TF-IDF + Logistic Regression để bắt các câu
            mà blacklist bỏ sót (ví dụ: cách nói mới, ẩn ý)
    
    Trả về True nếu phát hiện nội dung độc hại
    Trả về False nếu là tin nhắn bình thường
    """
    if not message or not message.strip():
        return False

    # LỚP 1: Keyword blacklist
    if keyword_check(message):
        return True

    # LỚP 2: AI Model
    global _ai_pipeline
    load_model()
    
    if _ai_pipeline is None:
        return False

    cleaned = clean_text(message)
    if not cleaned:
        return False

    try:
        probabilities = _ai_pipeline.predict_proba([cleaned])[0]
        toxic_prob = probabilities[1]
        return bool(toxic_prob > 0.55)
    except Exception as e:
        print(f"[AI Filter] Prediction error: {e}")
        return False
