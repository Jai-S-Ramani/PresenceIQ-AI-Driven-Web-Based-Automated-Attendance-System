"""
Attendance URL Configuration
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClassSessionViewSet, AttendanceViewSet, AttendanceStatisticsViewSet

router = DefaultRouter()
router.register(r'sessions', ClassSessionViewSet, basename='session')
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'statistics', AttendanceStatisticsViewSet, basename='statistics')

urlpatterns = [
    path('', include(router.urls)),
]
