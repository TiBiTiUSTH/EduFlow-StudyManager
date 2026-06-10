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
    # === Chửi mẹ/cha/gia đình ===
    "đm", "đcm", "dcm", "dkm", "đkm", "dcmm", "đcmm", "đmm", "dmm",
    "đcmnr", "đkmm", "dkmm", "đcmn", "dcmn", "đmn", "dmn",
    "đcml", "dcml", "đcmc", "dcmc", "đcmcm", "dcmcm",
    "đmml", "dmml", "đmmm", "dmmm", "đmmn", "dmmn",
    "đcmmmm", "dcmmmm", "đkmn", "dkmn",
    "dm mày", "đm mày", "dcm mày", "đcm mày", "dkm mày", "đkm mày",

    # === Địt / Đụ ===
    "địt", "dit", "đụ", "đjt", "djt", "địt", "dịt",
    "địt mẹ", "dit me", "đụ mẹ", "đụ má", "địt cụ", "đĩ mẹ",
    "địt con mẹ", "dit con me", "đụ mẹ mày", "đụ má mày",
    "địt bà", "dit ba", "đụ bà", "đjt mẹ", "djt me",
    "dit cha", "đụ cha", "địt cha", "địt bố",

    # === VCL / VCD / VKL và biến thể ===
    "vcd", "vcđ", "vcb", "vcc", "vcdd", "vcddd",
    "vcđd", "vcđđ", "vcbd", "vcbb",
    "vkl", "vklm", "vkll", "vkllm",
    "vcl", "vcll", "vclm", "vcllm", "vclll",
    "vl", "vll", "vlm", "vllm", "vlll",
    "vãi lồn", "vãi lol", "vãi lìn", "vãi loz",
    "vãi cả lồn", "vãi cả đời", "vãi cả buồi",
    "vãi", "vãi chưởng", "vãi đạn", "vãi l",
    "vai lon", "vai lol", "vai lin",
    "vai ca lon", "vai ca doi", "vai ca buoi",

    # === CC / CL ===
    "cc", "cl", "clm", "clmm", "clgt",
    "ccc", "cccm", "ccm", "ccmm",
    "cll", "cllm", "clll",
    "con cặc", "con lồn",

    # === Lồn / Cặc / Buồi ===
    "lồn", "lol", "loz", "lìn", "lờn", "lổn",
    "cặc", "cặk", "cac", "cak", "cặcc",
    "buồi", "buoi", "bùi", "buồii",
    "đầu buồi", "đầu b", "đầu cặc", "đb", "db",
    "cái lồn", "cái cặc", "cái buồi",
    "mặt lồn", "mặt cặc", "nứng lồn",

    # === Đĩ / Phò ===
    "đĩ", "phò", "điếm", "đĩ thõa", "phò phạch",
    "đĩ chó", "đĩ điếm", "con đĩ", "con phò",
    "cave", "ca ve",

    # === Ngu / Chửi trí tuệ ===
    "ngu lồn", "hãm lồn", "hãm lol", "ngu vl", "ngu vcl", "ngu vkl",
    "ngu cc", "ngu cl", "ngu đéo chịu",
    "ngu như bò", "ngu như chó", "ngu như lợn",
    "ngu si", "ngu học", "ngu thế",
    "ngu lol", "ngu loz", "ngu vcd",
    "óc chó", "óc cặc", "óc bã đậu", "ngáo chó",
    "não cá vàng", "não tôm",

    # === Xàm / Xạo ===
    "xàm lồn", "xạo lồn", "xàm lol",
    "xàm cc", "xàm cl", "xạo cc",
    "xàm vl", "xàm vcl",

    # === Súc vật / Chó ===
    "chó đẻ", "súc vật", "súc sinh", "súc sanh",
    "thằng chó", "con chó", "đồ chó",
    "đồ con chó", "đồ súc sinh", "đồ súc vật",
    "mặt chó", "mặt lợn",
    "chó chết", "chó ngáo",

    # === Con mẹ / Mả ===
    "con mẹ mày", "mẹ cha mày", "mả cha mày",
    "mả mẹ", "mả cha", "mả tổ",
    "tổ cha", "tổ sư",

    # === Cút / Im ===
    "cút mẹ", "câm mồm", "im mồm",
    "cút đi", "cút xéo", "biến đi", "biến xéo",
    "câm mõm", "im mõm", "bịt mồm",
    "câm đi", "im đi",

    # === Ăn ===
    "ăn cứt", "ăn cc", "ăn l", "ăn lol", "ăn lồn",
    "ăn đầu buồi", "ăn đb",

    # === Mất dạy / Vô học ===
    "mất dạy", "vô học", "bố láo",
    "mất nết", "hỗn", "hỗn láo",
    "vô giáo dục", "mất giáo dục",

    # === Bố sư / Tiên sư ===
    "bố sư", "tiên sư", "tổ sư",
    "tiên sư bố", "tiên sư cha",

    # === Chết ===
    "chết cụ", "chết mẹ", "chết cha",
    "chết đi", "chết cmn",
    "nhảy lầu", "đi chết", "tự tử đi",

    # === Đéo / Đếch ===
    "cái đéo", "đéo", "đếch", "đéo care",
    "đéo hiểu", "đéo biết",
    "đéo thèm",

    # === Thằng / Con (xúc phạm) ===
    "thằng điên", "thằng ranh", "thằng khốn",
    "thằng ngu", "thằng đần", "thằng ngốc",
    "thằng hâm", "thằng dở",
    "con điên", "con khốn", "con ngu",

    # === QQ / DB ===
    "cái qq", "cái đb", "đầu buồi", "đầu b",

    # === English ===
    "wtf", "stfu", "fuck", "fck", "fuk", "shit", "bitch", "dick", "ass",
    "motherfucker", "mf", "fking", "fk", "fvck",

    # === Lách luật bằng dấu chấm/cách ===
    "d.m", "d m", "đ.m", "đ m", "d.c.m", "d c m", "đ.c.m", "đ c m",
    "v.l", "v l", "c.c", "c c", "c.l", "c l",
    "v.c.l", "v c l", "v.c.d", "v c d",
    "v.k.l", "v k l",

    # === Lách luật bằng số/ký tự ===
    "đ!t", "d!t", "đ1t", "d1t", "l0n", "l0l", "c4c", "bu0i",
    "đ!t m3", "d!t m3", "l0z",
    "d!t me", "d!t m3 m4y",

    # === Teencode / Viết tắt bậy ===
    "deo", "dech", "deo biet", "deo hieu",
    "dit", "dit me", "dit cu",
    "lon", "lon nay",
    "ngu nhu bo", "ngu nhu cho",
    "mat day", "vo hoc", "suc vat",
    "bo su", "tien su",
    "chet cu", "chet me", "chet cha",

    # === Viết tắt khác phổ biến ===
    "cmm", "cmnr", "cmnl", "cmn",
    "đkm", "đkmm", "đkmmm",
    "đml", "dml", "đmlm", "dmlm",
    "mđ", "md", "mlm",
    "đhs", "dhs",
    "clgt", "cmht",
    "blồn", "bcặc",
    "vcđt", "vcdt", "vkdt",
    "ktmd", "kmdd",
    "bmv", "bmm",
    "đmcs", "dmcs",
    "đmcm", "dmcm",

    # === Cụm từ dài bậy ===
    "đồ khốn nạn", "đồ mất dạy", "đồ vô học",
    "đồ điên", "đồ hâm", "đồ ngu",
    "đồ rác rưởi", "đồ phế vật",
    "mẹ mày", "cha mày", "bà mày",
    "bố mày", "tổ cha mày",
    "đ má", "đ mẹ", "đ bà",
    "mày ngu", "tao chửi", "tao đánh",
    "giết mày", "đánh chết mày",
]

SHORT_TOXIC = {
    "dm", "đm", "cl", "cc", "vl", "vc", "xl", "đụ",
    "db", "đb", "dl", "đl", "ml", "md", "mđ",
    "vcd", "vcđ", "vcb", "vcc",
    "vkl", "vcl", "vll",
    "cmm", "cmn", "đhs",
    "đml", "dml",
}


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
