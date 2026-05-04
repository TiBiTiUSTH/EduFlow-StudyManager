import requests
import json

url = "https://eduflow-tuthaingu.as2.pitunnel.net/stms/auth/register"
payload = {
    "username": "testuser_api",
    "email": "test_api@gmail.com",
    "password": "password123",
    "full_name": "Test User",
    "role": "student"
}

headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
