"""
Face Recognition URL Configuration
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FaceEnrollmentViewSet,
    FaceRecognitionViewSet,
    RecognitionLogViewSet,
    FaceRecognitionSettingsViewSet
)

router = DefaultRouter()
router.register(r'enroll', FaceEnrollmentViewSet, basename='face-enroll')
router.register(r'recognize', FaceRecognitionViewSet, basename='face-recognize')
router.register(r'logs', RecognitionLogViewSet, basename='recognition-logs')
router.register(r'settings', FaceRecognitionSettingsViewSet, basename='face-settings')

urlpatterns = [
    path('', include(router.urls)),
]
