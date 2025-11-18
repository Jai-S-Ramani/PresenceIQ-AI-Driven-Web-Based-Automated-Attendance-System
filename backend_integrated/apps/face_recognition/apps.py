"""
Face Recognition App Configuration
"""

from django.apps import AppConfig


class FaceRecognitionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.face_recognition'
    verbose_name = 'Face Recognition'
    
    def ready(self):
        """Import signals when app is ready."""
        # Import signals here if needed
        pass
