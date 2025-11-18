"""
Face Recognition Models
Handles face data storage with 9-angle capture system
"""

from django.db import models
from django.conf import settings
import uuid
import os


def face_image_upload_path(instance, filename):
    """Generate upload path for face images."""
    ext = filename.split('.')[-1]
    filename = f"{instance.angle}_{uuid.uuid4().hex[:8]}.{ext}"
    return os.path.join('face_images', str(instance.face_data.user.id), filename)


class FaceData(models.Model):
    """
    Main face data model linked to user.
    Tracks enrollment status and metadata.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='face_data'
    )
    
    # Enrollment tracking
    is_complete = models.BooleanField(default=False)
    enrollment_date = models.DateTimeField(null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    # Face embeddings (stored as JSON for multiple models)
    insightface_embedding = models.JSONField(null=True, blank=True)
    deepface_embedding = models.JSONField(null=True, blank=True)
    dlib_embedding = models.JSONField(null=True, blank=True)
    
    # Quality metrics
    quality_score = models.FloatField(default=0.0)
    confidence_score = models.FloatField(default=0.0)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'face_data'
        verbose_name = 'Face Data'
        verbose_name_plural = 'Face Data'
        indexes = [
            # user index automatically created by ForeignKey
            models.Index(fields=['is_complete']),
        ]
    
    def __str__(self):
        return f"Face Data for {self.user.email}"
    
    @property
    def completion_percentage(self):
        """Calculate enrollment completion percentage."""
        total_images = self.images.count()
        return (total_images / 9) * 100 if total_images > 0 else 0
    
    @property
    def has_all_angles(self):
        """Check if all 9 angles are captured."""
        return self.images.count() == 9


class FaceImage(models.Model):
    """
    Individual face image for each angle.
    9 angles: center, up, down, left, right, up-left, up-right, down-left, down-right
    """
    
    ANGLE_CHOICES = [
        ('center', 'Center'),
        ('up', 'Up'),
        ('down', 'Down'),
        ('left', 'Left'),
        ('right', 'Right'),
        ('up_left', 'Up Left'),
        ('up_right', 'Up Right'),
        ('down_left', 'Down Left'),
        ('down_right', 'Down Right'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    face_data = models.ForeignKey(
        FaceData,
        on_delete=models.CASCADE,
        related_name='images', db_constraint=False)
    
    angle = models.CharField(max_length=20, choices=ANGLE_CHOICES)
    image = models.ImageField(upload_to=face_image_upload_path)
    
    # Image quality metrics
    brightness = models.FloatField(default=0.0)
    sharpness = models.FloatField(default=0.0)
    face_detected = models.BooleanField(default=False)
    detection_confidence = models.FloatField(default=0.0)
    
    # Timestamp
    captured_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'face_images'
        verbose_name = 'Face Image'
        verbose_name_plural = 'Face Images'
        unique_together = [['face_data', 'angle']]
        indexes = [
            # face_data index automatically created by ForeignKey
            models.Index(fields=['angle']),
        ]
    
    def __str__(self):
        return f"{self.face_data.user.email} - {self.get_angle_display()}"


class RecognitionLog(models.Model):
    """
    Log all face recognition attempts.
    Useful for debugging and analytics.
    """
    
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('no_face', 'No Face Detected'),
        ('low_confidence', 'Low Confidence'),
        ('multiple_faces', 'Multiple Faces'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Recognition attempt details
    image = models.ImageField(upload_to='recognition_logs/', null=True, blank=True)
    recognized_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='recognition_logs', db_constraint=False)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    confidence_score = models.FloatField(default=0.0)
    
    # Model results (JSON for detailed analysis)
    insightface_result = models.JSONField(null=True, blank=True)
    deepface_result = models.JSONField(null=True, blank=True)
    dlib_result = models.JSONField(null=True, blank=True)
    
    # Context
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Timestamp
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'recognition_logs'
        verbose_name = 'Recognition Log'
        verbose_name_plural = 'Recognition Logs'
        ordering = ['-timestamp']
        indexes = [
            # recognized_user index automatically created by ForeignKey
            models.Index(fields=['-timestamp']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        user = self.recognized_user.email if self.recognized_user else "Unknown"
        return f"{user} - {self.get_status_display()} ({self.timestamp})"


class FaceRecognitionSettings(models.Model):
    """
    Global settings for face recognition system.
    Singleton model (only one instance).
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Thresholds
    min_confidence_threshold = models.FloatField(default=0.6, help_text="Minimum confidence for recognition")
    quality_threshold = models.FloatField(default=0.5, help_text="Minimum quality for enrollment")
    
    # Model weights
    insightface_weight = models.FloatField(default=0.4)
    deepface_weight = models.FloatField(default=0.4)
    dlib_weight = models.FloatField(default=0.2)
    
    # Features
    enable_liveness_detection = models.BooleanField(default=True)
    enable_anti_spoofing = models.BooleanField(default=True)
    log_all_attempts = models.BooleanField(default=True)
    
    # Performance
    max_recognition_time = models.IntegerField(default=5, help_text="Seconds")
    batch_processing = models.BooleanField(default=False)
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'face_recognition_settings'
        verbose_name = 'Face Recognition Settings'
        verbose_name_plural = 'Face Recognition Settings'
    
    def __str__(self):
        return "Face Recognition Settings"
    
    def save(self, *args, **kwargs):
        """Ensure only one instance exists."""
        self.pk = 1
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        """Get or create settings instance."""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
