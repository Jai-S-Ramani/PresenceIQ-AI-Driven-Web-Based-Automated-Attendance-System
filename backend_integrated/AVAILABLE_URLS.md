# 🌐 PresenceIQ Backend - Available URLs

## ✅ Server Status: OPERATIONAL

**Server URL:** http://127.0.0.1:8000/

---

## 🏠 Root Endpoint

### GET /

Returns API information and available endpoints.

**URL:** http://127.0.0.1:8000/

**Response:**

```json
{
	"message": "Welcome to PresenceIQ Backend API",
	"version": "1.0.0",
	"endpoints": {
		"admin": "/admin/",
		"api": "/api/",
		"health": "/api/health/",
		"authentication": "/api/auth/",
		"academic": "/api/academic/",
		"attendance": "/api/attendance/",
		"face_recognition": "/api/face/",
		"reports": "/api/reports/",
		"notifications": "/api/notifications/"
	},
	"status": "operational"
}
```

---

## 🔐 Admin Panel

### Django Admin Interface

**URL:** http://127.0.0.1:8000/admin/

**Login Credentials:**

-   Email: s0405verma@gmail.com
-   Password: [Your password]

**Available Sections:**

-   Authentication and Authorization
    -   Users
    -   Groups
-   Academic
    -   Departments
    -   Subjects
    -   Timetables
    -   Holidays
-   Attendance
    -   Class Sessions
    -   Attendance Records
    -   Attendance Statistics
    -   Attendance Reports
-   Face Recognition
    -   Face Data
    -   Face Images
    -   Recognition Logs
-   And more...

---

## 🏥 Health Check

### GET /api/health/

Check if the API is running.

**URL:** http://127.0.0.1:8000/api/health/

---

## 🔑 Authentication Endpoints

Base URL: `/api/auth/`

### Register New User

**POST** `/api/auth/register/`

**Body:**

```json
{
	"email": "user@example.com",
	"password": "password123",
	"first_name": "John",
	"last_name": "Doe",
	"role": "student"
}
```

### Login

**POST** `/api/auth/login/`

**Body:**

```json
{
	"email": "user@example.com",
	"password": "password123"
}
```

**Response:**

```json
{
	"access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
	"refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
	"user": {
		"id": "uuid",
		"email": "user@example.com",
		"role": "student"
	}
}
```

### Logout

**POST** `/api/auth/logout/`

### Get Profile

**GET** `/api/auth/profile/`

### Update Profile

**PUT/PATCH** `/api/auth/profile/`

---

## 🎓 Academic Endpoints

Base URL: `/api/academic/`

### Departments

-   **GET** `/api/academic/departments/` - List all departments
-   **POST** `/api/academic/departments/` - Create department
-   **GET** `/api/academic/departments/{id}/` - Get department details
-   **PUT/PATCH** `/api/academic/departments/{id}/` - Update department
-   **DELETE** `/api/academic/departments/{id}/` - Delete department

### Subjects

-   **GET** `/api/academic/subjects/` - List all subjects
-   **POST** `/api/academic/subjects/` - Create subject
-   **GET** `/api/academic/subjects/{id}/` - Get subject details
-   **PUT/PATCH** `/api/academic/subjects/{id}/` - Update subject
-   **DELETE** `/api/academic/subjects/{id}/` - Delete subject

### Timetables

-   **GET** `/api/academic/timetable/` - List all timetable entries
-   **POST** `/api/academic/timetable/` - Create timetable entry
-   **GET** `/api/academic/timetable/{id}/` - Get timetable details
-   **PUT/PATCH** `/api/academic/timetable/{id}/` - Update timetable
-   **DELETE** `/api/academic/timetable/{id}/` - Delete timetable

### Holidays

-   **GET** `/api/academic/holidays/` - List all holidays
-   **POST** `/api/academic/holidays/` - Create holiday
-   **GET** `/api/academic/holidays/{id}/` - Get holiday details
-   **PUT/PATCH** `/api/academic/holidays/{id}/` - Update holiday
-   **DELETE** `/api/academic/holidays/{id}/` - Delete holiday

---

## 📊 Attendance Endpoints

Base URL: `/api/attendance/`

### Class Sessions

-   **GET** `/api/attendance/sessions/` - List all class sessions
-   **POST** `/api/attendance/sessions/` - Create class session
-   **GET** `/api/attendance/sessions/{id}/` - Get session details
-   **PUT/PATCH** `/api/attendance/sessions/{id}/` - Update session
-   **DELETE** `/api/attendance/sessions/{id}/` - Delete session

### Mark Attendance

-   **POST** `/api/attendance/mark/` - Mark attendance for a student

**Body:**

```json
{
	"session_id": "uuid",
	"student_id": "uuid",
	"status": "present",
	"marked_by": "uuid"
}
```

### Attendance Statistics

-   **GET** `/api/attendance/statistics/` - Get attendance statistics
-   **GET** `/api/attendance/statistics/{student_id}/` - Get student statistics

### Attendance Reports

-   **GET** `/api/attendance/reports/` - List all reports
-   **POST** `/api/attendance/reports/` - Generate report

---

## 👤 Face Recognition Endpoints

Base URL: `/api/face/`

### Register Face

**POST** `/api/face/register/`

Upload face images for recognition.

**Body (multipart/form-data):**

-   `user_id`: UUID of the user
-   `images`: Array of face images (9 angles required)

### Recognize Face

**POST** `/api/face/recognize/`

Recognize a face from an image.

**Body (multipart/form-data):**

-   `image`: Face image to recognize

**Response:**

```json
{
	"recognized": true,
	"user_id": "uuid",
	"confidence": 0.95,
	"user_details": {
		"name": "John Doe",
		"role": "student",
		"student_id": "12345"
	}
}
```

### Get Face Data

-   **GET** `/api/face/data/` - List all face data
-   **GET** `/api/face/data/{user_id}/` - Get user's face data

---

## 📈 Reports Endpoints

Base URL: `/api/reports/`

### Attendance Reports

-   **GET** `/api/reports/attendance/` - Generate attendance report
-   **GET** `/api/reports/attendance/student/{id}/` - Student attendance report
-   **GET** `/api/reports/attendance/subject/{id}/` - Subject attendance report

### Faculty Reports

-   **GET** `/api/reports/faculty/{id}/` - Faculty performance report

### Department Reports

-   **GET** `/api/reports/department/{id}/` - Department report

---

## 🔔 Notifications Endpoints

Base URL: `/api/notifications/`

### List Notifications

-   **GET** `/api/notifications/` - Get user's notifications

### Mark as Read

-   **POST** `/api/notifications/{id}/read/` - Mark notification as read

### Send Notification

-   **POST** `/api/notifications/send/` - Send notification (admin only)

---

## 🐛 Debug Toolbar

**URL:** http://127.0.0.1:8000/__debug__/

Available only when `DEBUG=True`.

---

## 📝 Testing with PowerShell

### Get Root Info

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8000/" -Method GET | Select-Object -ExpandProperty Content
```

### Health Check

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/health/" -Method GET
```

### Register User

```powershell
$body = @{
    email = "test@example.com"
    password = "testpass123"
    first_name = "Test"
    last_name = "User"
    role = "student"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/auth/register/" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Login

```powershell
$body = @{
    email = "test@example.com"
    password = "testpass123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/auth/login/" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$response.Content | ConvertFrom-Json
```

---

## 🔧 Common Issues

### 404 Error on Root URL

✅ **FIXED** - Root URL now returns API information

### Admin Login Not Working

-   Make sure you created a superuser
-   Use email (not username) to login
-   Password is case-sensitive

### CSRF Token Error

-   For API calls, include JWT token in headers
-   Or disable CSRF for API endpoints (already configured)

### CORS Error from Frontend

-   Already configured for localhost:5173
-   If using different port, update CORS_ALLOWED_ORIGINS in settings

---

## 📚 Quick Links

-   **Admin Panel:** http://127.0.0.1:8000/admin/
-   **API Root:** http://127.0.0.1:8000/
-   **Health Check:** http://127.0.0.1:8000/api/health/
-   **Debug Toolbar:** http://127.0.0.1:8000/__debug__/

---

## 🚀 Next Steps

1. ✅ **Backend is running** - All migrations complete
2. ✅ **Admin panel accessible** - Can manage data
3. ✅ **API endpoints ready** - Can accept requests
4. ⏳ **Test API endpoints** - Use Postman or frontend
5. ⏳ **Connect frontend** - Integrate React app
6. ⏳ **Add sample data** - Create test departments, subjects, etc.

---

**Last Updated:** November 18, 2025  
**Status:** ✅ OPERATIONAL
