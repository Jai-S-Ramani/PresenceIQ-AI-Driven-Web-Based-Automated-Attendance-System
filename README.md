# PresenceIQ - Smart Attendance Management System# 📸 PresenceIQ - Intelligent Attendance Management System

A comprehensive attendance management system using face recognition technology, built with Django REST Framework and React.<div align="center">

## 🎯 Project Overview![PresenceIQ Logo](https://img.shields.io/badge/PresenceIQ-AI%20Attendance-blue?style=for-the-badge)

![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)

PresenceIQ is a modern attendance tracking system that uses facial recognition to mark student attendance automatically. The system includes role-based access for Students, Faculty, HOD, and Admin users.![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

## 🏗️ Technology Stack**A modern, AI-powered attendance management system with facial recognition**

### Backend[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

-   **Framework**: Django 4.1.13 + Django REST Framework

-   **Database**: MongoDB (via djongo)</div>

-   **Authentication**: JWT (Simple JWT)

-   **Face Recognition**: Ready for integration (dlib/face-recognition)---

-   **Image Processing**: Pillow

## 🌟 Features

### Frontend

-   **Framework**: React 18 + Vite### 🎯 Core Functionality

-   **Routing**: React Router DOM

-   **UI Library**: Tailwind CSS- ✨ **Facial Recognition Attendance**: AI-powered facial recognition for contactless attendance

-   **Charts**: Chart.js + react-chartjs-2- 👥 **Multi-Role Support**: Student, Faculty, HOD, and Admin dashboards

-   **HTTP Client**: Axios- 📊 **Real-time Analytics**: Interactive charts and attendance statistics

-   **Forms**: Formik + Yup- 📱 **Responsive Design**: Beautiful glassmorphism UI with Tailwind CSS

-   🔐 **Secure Authentication**: JWT-based authentication with role-based access control

## 📁 Project Structure

### 📈 Advanced Features

````

PresenceIQ/-   📸 **9-Angle Face Registration**: Comprehensive facial data capture

├── backend/                    # Django backend-   📅 **Attendance Reports**: Generate PDF and Excel reports

│   ├── presenceiq/            # Main Django project-   🎓 **Subject Management**: CRUD operations for courses and subjects

│   ├── users/                 # User authentication & profiles-   📧 **Email Notifications**: Automated attendance alerts

│   ├── classes/               # Class & enrollment management-   🌍 **Geolocation Support**: Optional location-based attendance

│   ├── attendance/            # Attendance tracking-   📱 **Webcam Integration**: In-browser camera access for attendance marking

│   ├── face_recognition/      # Face recognition (future)

│   ├── reports/               # Report generation### 👨‍💼 Role-Based Dashboards

│   ├── notifications/         # Notification system

│   └── manage.py-   **Students**: View attendance, register face, download reports

│-   **Faculty**: Mark attendance, view class statistics, manage subjects

├── frontend/                   # React frontend-   **HOD**: Department-wide analytics, faculty oversight

│   ├── src/-   **Admin**: User management, system configuration, global statistics

│   │   ├── components/        # Reusable components

│   │   ├── pages/             # Page components---

│   │   ├── services/          # API services

│   │   └── utils/             # Utility functions## 🛠️ Tech Stack

│   └── package.json

│### Backend (Django + DRF)

├── media/                      # Uploaded files (face images, documents)

├── docker-compose.yml         # Docker configuration```

└── README.md🐍 Django 4.2              - Web framework

```🔌 Django REST Framework   - API framework

🗄️ MongoDB                 - Database

## 🚀 Quick Start🤖 TensorFlow              - Machine learning

👁️ OpenCV                  - Computer vision

### Prerequisites🔐 JWT                     - Authentication

- Python 3.11+🚀 Python 3.10+           - Programming language

- Node.js 18+```

- MongoDB 6.0+

- Git### Frontend (React + Vite)



### 1. Clone the Repository```

```bash⚛️ React 18.2              - UI framework

git clone <repository-url>⚡ Vite 5.0                - Build tool

cd PresenceIQ🎨 Tailwind CSS 3.4        - Styling

```🧭 React Router 5.3        - Navigation

📊 Chart.js 4.4            - Data visualization

### 2. Backend Setup📋 Formik + Yup           - Form management

🔔 React Toastify         - Notifications

```bash📷 React Webcam           - Camera access

# Navigate to backend```

cd backend

### DevOps & Tools

# Create virtual environment

python -m venv venv```

🐳 Docker & Docker Compose - Containerization

# Activate virtual environment🌐 Nginx                   - Web server

# Windows:📝 Git                     - Version control

venv\Scripts\activate📦 npm                     - Package manager

# Linux/Mac:```

source venv/bin/activate

---

# Install dependencies

pip install -r requirements.txt## 🚀 Quick Start



# Run migrations### Prerequisites

python manage.py migrate

-   Python 3.10+

# Create superuser-   Node.js 18+

python manage.py createsuperuser-   MongoDB

-   Git

# Start development server

python manage.py runserver### 🔧 Installation

````

#### 1️⃣ Clone the Repository

Backend will run on: **http://localhost:8000**

````bash

### 3. Frontend Setupgit clone https://github.com/sumitverma21/PresenceIQ.git

cd PresenceIQ

```bash```

# Navigate to frontend (in new terminal)

cd frontend#### 2️⃣ Backend Setup



# Install dependencies```bash

npm install# Navigate to backend directory

cd backend

# Start development server

npm run dev# Create virtual environment

```python -m venv venv



Frontend will run on: **http://localhost:5173**# Activate virtual environment

# Windows:

### 4. MongoDB Setupvenv\Scripts\activate

# macOS/Linux:

Make sure MongoDB is running:source venv/bin/activate

```bash

# Windows (if installed as service)# Install dependencies

net start MongoDBpip install -r requirements.txt



# Or run manually# Copy environment file

mongod --dbpath "C:\data\db"cp .env.example .env

```# Edit .env with your configuration



## 👥 User Roles# Run migrations

python manage.py makemigrations

### Studentpython manage.py migrate

- View own attendance records

- Register face for recognition# Create superuser (optional)

- View class schedulepython manage.py createsuperuser

- Download attendance reports

# Run development server

### Facultypython manage.py runserver

- Mark attendance (manual/face recognition)```

- View class attendance reports

- Register new studentsBackend will run on: `http://localhost:8000`

- Upload student face data

- Manage class sessions#### 3️⃣ Frontend Setup



### HOD (Head of Department)```bash

- View department-wide statistics# Navigate to frontend directory

- Access all faculty reportscd frontend

- Manage faculty accounts

- Department analytics# Install dependencies

npm install

### Admin

- Full system access# Copy environment file

- User management (all roles)cp .env.example .env

- System configuration# Edit .env with your configuration

- View all logs and reports

# Run development server

## 🔑 Default Login Credentialsnpm run dev

````

After running migrations and creating test data:

Frontend will run on: `http://localhost:5173`

````

Faculty:### Frontend Setup

Email: faculty@test.com

Password: password1. Navigate to the `frontend` directory:



Student (example):    ```

Email: student_CS2023001@test.com    cd frontend

Password: password123    ```

````

2. Install the required npm packages:

## 📊 Database Collections

    ```

### Core Collections npm install

-   **users** - User accounts with role-based access ```

-   **classes** - Class information (name, code, department, year, section)

-   **class_enrollments** - Student-class relationships3. Start the React application:

-   **attendance_sessions** - Attendance session records ```

-   **attendance_records** - Individual attendance marks npm start

    ```

    ```

### Face Recognition (New)

-   **face_data** - Face images and embeddings## Database Setup

-   **student_profiles** - Extended student information

-   **user_registration_logs** - Audit trail for registrationsEnsure that MongoDB is installed and running. Configure the database settings in the `settings.py` file of the backend.

## 🔧 Key Features## Contributing

### ✅ ImplementedContributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

-   User authentication with JWT

-   Role-based access control## License

-   Class and enrollment management

-   Manual attendance markingThis project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

-   Attendance reports and statistics

-   Student profile management## Acknowledgments

-   Face data storage (database + files)

-   Bulk student upload- Thanks to the open-source community for their invaluable contributions.

-   Registration audit trail- Special thanks to the developers and designers who made this project possible.

### 🚧 In Progress

-   Face recognition integration
-   Automated attendance via camera
-   Real-time notifications
-   Mobile app integration

### 📋 Planned

-   Email notifications
-   SMS alerts
-   Biometric fingerprint
-   Advanced analytics dashboard
-   Parent portal

## 📡 API Endpoints

### Authentication

```
POST   /api/users/register/          - Register new user
POST   /api/users/login/             - User login
POST   /api/users/token/refresh/     - Refresh JWT token
```

### Classes & Enrollment

```
GET    /api/classes/                 - List all classes
POST   /api/classes/                 - Create new class
GET    /api/classes/{id}/students/   - Get class students
POST   /api/enrollments/             - Enroll student in class
```

### Attendance

```
GET    /api/attendance/sessions/     - List attendance sessions
POST   /api/attendance/sessions/     - Create new session
POST   /api/attendance/mark/         - Mark attendance
GET    /api/attendance/reports/      - Get attendance reports
```

### Face Recognition

```
POST   /api/users/face-data/         - Upload face data
GET    /api/users/student-profiles/  - List students
POST   /api/users/student-profiles/bulk_upload/ - Bulk upload
GET    /api/users/registration-logs/ - View logs (admin)
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### Populate Test Data

```bash
cd backend
python manage.py populate_test_data
```

This creates:

-   20 test students (CS2023001 - CS2023020)
-   1 test class (CS101)
-   Enrollments for all students
-   1 faculty user

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop containers
docker-compose down
```

## 📝 Environment Variables

Create `.env` file in backend directory:

```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=presenceiq

# JWT
JWT_SECRET_KEY=your-jwt-secret-key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Media Files
MEDIA_ROOT=media/
MEDIA_URL=/media/
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📖 Documentation

For detailed documentation, see:

-   [Face Data Models](./FACE_DATA_DATABASE_MODELS.md) - Database schema for face recognition
-   [API Testing Guide](./FACE_DATA_API_TESTING.md) - How to test API endpoints
-   [Implementation Summary](./FACE_DATA_IMPLEMENTATION_SUMMARY.md) - Technical implementation details

## 🐛 Known Issues

-   Djongo has limited support for complex Django ORM queries (avoid boolean filters)
-   Face recognition processing needs to be implemented in `upload_face` action
-   Media file serving needs nginx/S3 configuration for production

## 📞 Support

For issues and questions:

-   Create an issue on GitHub
-   Email: support@presenceiq.com (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Django REST Framework team
-   React team
-   MongoDB team
-   Face recognition library contributors

---

**Built with ❤️ for educational institutions**

Last Updated: November 14, 2025
