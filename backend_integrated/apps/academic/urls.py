"""
Academic URL Configuration
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, SubjectViewSet, TimetableViewSet, HolidayViewSet

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'subjects', SubjectViewSet, basename='subject')
router.register(r'timetable', TimetableViewSet, basename='timetable')
router.register(r'holidays', HolidayViewSet, basename='holiday')

urlpatterns = [
    path('', include(router.urls)),
]
