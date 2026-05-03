import os
import json
import redis
import functools
from fastapi import Request, Response
from pydantic import BaseModel

# Khởi tạo kết nối Redis
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.from_url(REDIS_URL)

def get_cache_key(request: Request, user_id: int) -> str:
    """Tạo cache key duy nhất dựa trên URL path và user ID."""
    return f"cache:{request.url.path}:user:{user_id}"

def cache_response(expire_seconds: int = 180):
    """
    Decorator để cache response của FastAPI GET endpoint vào Redis.
    Nó yêu cầu `current_user` và `request` trong kwargs.
    """
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            request: Request = kwargs.get('request')
            current_user = kwargs.get('current_user')
            
            if not request or not current_user:
                return await func(*args, **kwargs)

            cache_key = get_cache_key(request, current_user.id)
            
            try:
                cached_data = redis_client.get(cache_key)
                if cached_data:
                    # Trả về JSON string đã cache
                    return json.loads(cached_data)
            except redis.RedisError as e:
                print(f"[Redis Cache Error]: {e}")

           
            result = await func(*args, **kwargs)
            
            try:
                if isinstance(result, list):
                    json_data = []
                    for item in result:
                        if hasattr(item, 'dict'):
                            json_data.append(item.dict())
                        elif hasattr(item, '__dict__'):
                            d = item.__dict__.copy()
                            d.pop('_sa_instance_state', None)
                            
                            for k, v in d.items():
                                if hasattr(v, 'isoformat'):
                                    d[k] = v.isoformat()
                            json_data.append(d)
                        else:
                            json_data.append(item)
                    
                    # Lưu vào Redis
                    redis_client.setex(cache_key, expire_seconds, json.dumps(json_data))
            except Exception as e:
                print(f"[Redis Cache Serialize Error]: {e}")

            return result
        return wrapper
    return decorator

def invalidate_cache(path_prefix: str, user_id: int):
    """
    Xóa cache cho một path prefix cụ thể và user.
    Ví dụ: invalidate_cache("/stms/tasks", user.id)
    """
    try:
        pattern = f"cache:{path_prefix}*:user:{user_id}"
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
    except redis.RedisError as e:
        print(f"[Redis Invalidate Error]: {e}")
