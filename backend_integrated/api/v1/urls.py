"""
API v1 URL Configuration
"""

from django.urls import path, include

app_name = 'api_v1'

urlpatterns = [
    # Authentication
    path('auth/', include('apps.authentication.urls')),
    
    # Face Recognition
    path('face/', include('apps.face_recognition.urls')),
    
    # Attendance
    path('attendance/', include('apps.attendance.urls')),
    
    # Academic
    path('academic/', include('apps.academic.urls')),
    
    # Reports
    path('reports/', include('apps.reports.urls')),
    
    # Dashboards
    path('dashboards/', include('apps.dashboards.urls')),
    
    # Notifications
    path('notifications/', include('apps.notifications.urls')),
]
