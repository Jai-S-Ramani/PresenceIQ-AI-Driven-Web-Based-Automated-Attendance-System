# 🚀 PresenceIQ Integrated Backend

**AI-Powered Attendance Management System with 9-Angle Face Recognition**

---

## 📋 Overview

This is the integrated backend for PresenceIQ, combining the best features from both previous implementations:

-   Production-ready Django architecture
-   JWT authentication
-   9-Angle face capture system
-   Multi-model AI recognition (InsightFace, DeepFace, dlib)
-   Email/SMS notifications
-   MongoDB database
-   Complete REST API

---

## 🏗️ Architecture

```
backend_integrated/
├── config/                 # Django settings
├── apps/                   # 8 modular applications
│   ├── authentication/     # User auth & JWT
│   ├── users/             # User profiles
│   ├── attendance/        # Attendance processing
│   ├── face_recognition/  # AI & 9-angle system
│   ├── notifications/     # Email/SMS/Push
│   ├── academic/          # Classes, subjects
│   ├── reports/           # PDF/Excel reports
│   └── dashboards/        # Role-based views
├── core/                  # Shared utilities
└── api/                   # API gateway (v1)
```

---

## ⚡ Quick Start (60 minutes)

### 1. Prerequisites

-   Python 3.9+
-   MongoDB 4.4+
-   Redis (optional, for Celery)

### 2. Installation

```powershell
# Clone and navigate
cd C:\Users\Sumit\Desktop\PIQ\PresenceIQ\backend_integrated

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
DJANGO_SECRET_KEY=your-secret-key
MONGO_DB_NAME=presenceiq
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 4. Database Setup

```powershell
# Make sure MongoDB is running
# Then run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 5. Run Server

```powershell
python manage.py runserver
```

**Server will be running at:** `http://localhost:8000`

---

## 📡 API Endpoints

### Authentication

-   `POST /api/auth/register/` - User registration
-   `POST /api/auth/login/` - User login
-   `POST /api/auth/logout/` - User logout
-   `GET  /api/auth/user/` - Get current user
-   `PUT  /api/auth/profile/` - Update profile
-   `POST /api/auth/change-password/` - Change password

### Health Check

-   `GET /api/health/` - API health status

---

## 🔐 Authentication

### Register User

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePass123",
    "password_confirm": "SecurePass123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student",
    "student_id": "STU001"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePass123"
  }'
```

Response includes JWT tokens:

```json
{
  "user": {...},
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

### Authenticated Requests

```bash
curl -X GET http://localhost:8000/api/auth/user/ \
  -H "Authorization: Bearer <access_token>"
```

---

## 🗄️ Database (MongoDB)

### Connection String

```
mongodb://localhost:27017/presenceiq
```

### Collections Created

-   `users` - User accounts
-   `departments` - Departments
-   (More will be added as we implement other apps)

### View Data with MongoDB Compass

1. Download MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select `presenceiq` database

---

## 📧 Email Configuration

### Gmail Setup (Development)

1. Enable 2-Step Verification in Google Account
2. Generate App Password
3. Update `.env`:

```bash
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-character-app-password
```

### Test Email

```powershell
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Message', 'from@example.com', ['to@example.com'])
```

---

## 🧪 Testing

### Run Tests

```powershell
pytest

# With coverage
pytest --cov=apps --cov-report=html
```

### Test Authentication

```powershell
# Create test user
python manage.py shell
>>> from apps.authentication.models import User
>>> user = User.objects.create_user(
...     email='test@test.com',
...     password='test123',
...     first_name='Test',
...     last_name='User'
... )
```

---

## 🔧 Development

### Project Structure

```
backend_integrated/
├── manage.py               # Django management
├── requirements.txt        # Dependencies
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
│
├── config/                # Django configuration
│   ├── settings/
│   │   ├── base.py        # Base settings
│   │   ├── development.py # Dev settings
│   │   └── production.py  # Prod settings
│   ├── urls.py            # Main URL routing
│   ├── wsgi.py            # WSGI application
│   └── asgi.py            # ASGI application
│
├── apps/                  # Application modules
│   └── authentication/    # Auth app (implemented)
│       ├── models.py      # User, Department models
│       ├── serializers.py # DRF serializers
│       ├── views.py       # API views
│       ├── urls.py        # URL routing
│       └── admin.py       # Admin configuration
│
├── core/                  # Shared utilities
│   ├── views.py          # Health check
│   ├── exceptions.py     # Custom exceptions
│   └── urls.py           # Core URLs
│
└── api/                   # API gateway
    └── v1/
        └── urls.py        # API v1 routing
```

### Adding New Apps

```powershell
# Create app
cd apps
mkdir new_app
cd new_app

# Create files
# __init__.py, apps.py, models.py, views.py, urls.py, admin.py

# Register in config/settings/base.py
INSTALLED_APPS = [
    ...
    'apps.new_app',
]

# Add to api/v1/urls.py
urlpatterns = [
    ...
    path('new-app/', include('apps.new_app.urls')),
]
```

---

## 🚀 Deployment

### Production Checklist

-   [ ] Set `DEBUG=False` in `.env`
-   [ ] Set strong `DJANGO_SECRET_KEY`
-   [ ] Configure `ALLOWED_HOSTS`
-   [ ] Setup proper MongoDB credentials
-   [ ] Configure SMTP for email
-   [ ] Setup HTTPS/SSL
-   [ ] Run `collectstatic`
-   [ ] Setup Gunicorn + Nginx
-   [ ] Configure Celery workers
-   [ ] Setup monitoring (Sentry)

### Run with Gunicorn

```powershell
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

---

## 📚 Documentation

-   [FINAL_INTEGRATED_BACKEND.md](../FINAL_INTEGRATED_BACKEND.md) - Complete architecture
-   [IMPLEMENTATION_CODE_GUIDE.md](../IMPLEMENTATION_CODE_GUIDE.md) - Code examples
-   [BACKEND_ARCHITECTURE_VISUAL.md](../BACKEND_ARCHITECTURE_VISUAL.md) - Visual diagrams
-   [QUICK_START.md](../QUICK_START.md) - Quick reference

---

## 🛠️ Tech Stack

-   **Backend**: Django 4.2.7 + DRF 3.14.0
-   **Database**: MongoDB (djongo)
-   **Authentication**: JWT (simplejwt)
-   **AI/ML**: InsightFace, DeepFace, dlib
-   **Email**: SMTP (Gmail)
-   **Tasks**: Celery + Redis
-   **Reports**: reportlab, openpyxl
-   **Testing**: pytest

---

## 🎯 Features

### Implemented

✅ User authentication (register, login, logout)  
✅ JWT token management  
✅ Role-based access (admin, hod, faculty, student)  
✅ User profile management  
✅ MongoDB integration  
✅ Health check API  
✅ Django admin panel

### Coming Soon

🔜 9-angle face capture system  
🔜 Multi-model face recognition  
🔜 Attendance marking  
🔜 Email notifications  
🔜 PDF/Excel reports  
🔜 Analytics dashboards

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: MongoClient failed to connect
Solution: Make sure MongoDB is running
  - Windows: Check Services for "MongoDB Server"
  - Start: net start MongoDB
```

### Import Error

```
Error: No module named 'djongo'
Solution: Reinstall dependencies
  pip install -r requirements.txt
```

### Migration Issues

```
Error: Table already exists
Solution: Reset migrations
  python manage.py migrate --fake-initial
```

---

## 👥 Contributors

-   Sumit Verma (@verma0821)

---

## 📄 License

This project is part of PresenceIQ and follows the main project license.

---

## 🎓 Next Steps

1. ✅ **Authentication Complete** - Users can register and login
2. 🔜 **Implement Face Recognition** - Add 9-angle capture
3. 🔜 **Attendance Module** - Mark attendance with AI
4. 🔜 **Dashboards** - Admin, Teacher, Student views
5. 🔜 **Notifications** - Email/SMS alerts
6. 🔜 **Reports** - PDF/Excel generation

---

**Status**: 🟢 Authentication Working | 🟡 Face Recognition Pending | 🟡 Other Modules Pending

**Last Updated**: November 18, 2025
