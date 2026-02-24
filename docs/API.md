# EduFlow API Documentation

Complete API reference for the EduFlow Study Time Management System.

## Base URL

- **Local**: `http://localhost:8000`
- **Docker**: `http://localhost:8000`

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require JWT authentication.

### Headers

```http
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 🔐 Authentication

#### Login

```http
POST /stms/auth/login
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```
username=admin
password=123
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "roles": ["admin"],
  "username": "admin"
}
```

#### Register

```http
POST /stms/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepass123",
  "full_name": "John Doe",
  "role": "student"
}
```

**Response:**
```json
{
  "message": "Registration successful. Please verify OTP.",
  "username": "newuser"
}
```

#### Verify OTP

```http
POST /stms/auth/verify-otp
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "newuser",
  "otp_code": "123456"
}
```

**Response:**
```json
{
  "message": "OTP verified successfully. You can now login."
}
```

---

### 📋 Tasks

#### Get All Tasks

```http
GET /stms/tasks
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete Math Homework",
    "description": "Solve problems 1-20",
    "subject_id": 1,
    "priority": "high",
    "status": "pending",
    "due_date": "2026-02-20T00:00:00",
    "created_at": "2026-02-15T10:00:00"
  }
]
```

#### Create Task

```http
POST /stms/tasks
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Study Physics",
  "description": "Chapter 3 review",
  "subject_id": 2,
  "priority": "medium",
  "status": "pending",
  "due_date": "2026-02-22"
}
```

#### Update Task

```http
PUT /stms/tasks/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "completed",
  "priority": "low"
}
```

#### Delete Task

```http
DELETE /stms/tasks/{id}
Authorization: Bearer <token>
```

---

### 📅 Schedules

#### Get All Schedules

```http
GET /stms/schedules
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Math Study Session",
    "subject_id": 1,
    "start_time": "14:00:00",
    "end_time": "16:00:00",
    "day_of_week": "Monday",
    "user_id": 2
  }
]
```

#### Create Schedule

```http
POST /stms/schedules
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "English Reading",
  "subject_id": 3,
  "start_time": "09:00",
  "end_time": "10:30",
  "day_of_week": "Tuesday"
}
```

---

### 📚 Subjects

#### Get All Subjects

```http
GET /stms/subjects
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Mathematics",
    "description": "Advanced Calculus",
    "color": "#3B82F6",
    "user_id": 2
  }
]
```

#### Create Subject

```http
POST /stms/subjects
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Physics",
  "description": "Quantum Mechanics",
  "color": "#10B981"
}
```

---

### 🔔 Notifications

#### Get Notifications

```http
GET /stms/notifications
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Task Reminder",
    "message": "Your Math homework is due tomorrow",
    "type": "reminder",
    "is_read": false,
    "created_at": "2026-02-15T08:00:00"
  }
]
```

---

### ❤️ Health Check

```http
GET /stms/health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "detail": "Incorrect username or password"
}
```

### 403 Forbidden

```json
{
  "detail": "Account not verified. Please verify your OTP."
}
```

### 404 Not Found

```json
{
  "detail": "User not found"
}
```

### 422 Validation Error

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format",
      "type": "value_error"
    }
  ]
}
```

---

## Using Postman

### 1. Import Collection

- Open Postman
- Click **Import**
- Select `docs/EduFlow.postman_collection.json`
- Import `docs/EduFlow.postman_environment.json`

### 2. Select Environment

- Click environment dropdown (top right)
- Select "EduFlow Environment"

### 3. Login

- Run "Authentication > Login" request
- Token is automatically saved to environment variable `{{token}}`

### 4. Test Endpoints

- All other requests will automatically use the token
- Modify request bodies as needed

### 5. Update Variables

- `base_url`: Change if using different host
- `admin_username`: Update if using different admin
- `admin_password`: Update if changed

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production.

## Pagination

Future improvement - endpoints will support `?page=1&limit=10` parameters.

## Filtering

Future improvement - endpoints will support query parameters for filtering (e.g., `?status=pending`).
