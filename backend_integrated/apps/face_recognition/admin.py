"""
Face Recognition Admin Configuration
"""

from django.contrib import admin
from django import forms
from .models import FaceData, FaceImage, RecognitionLog, FaceRecognitionSettings


class FaceDataAdminForm(forms.ModelForm):
    """Custom form for FaceData to handle djongo ForeignKey validation issues."""
    
    class Meta:
        model = FaceData
        fields = '__all__'
    
    def _post_clean(self):
        """Override to skip model validation that triggers djongo issues."""
        # Set cleaned data directly on instance without full model validation
        for field_name, value in self.cleaned_data.items():
            setattr(self.instance, field_name, value)


class FaceImageInline(admin.TabularInline):
    """Inline display for face images."""
    model = FaceImage
    extra = 0
    readonly_fields = ['angle', 'brightness', 'sharpness', 'face_detected', 'detection_confidence', 'captured_at']
    fields = ['angle', 'image', 'face_detected', 'detection_confidence', 'brightness', 'sharpness', 'captured_at']


@admin.register(FaceData)
class FaceDataAdmin(admin.ModelAdmin):
    """Admin for FaceData."""
    
    form = FaceDataAdminForm
    list_display = ['user', 'is_complete', 'quality_score', 'confidence_score', 'enrollment_date', 'last_updated']
    list_filter = ['is_complete', 'enrollment_date']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['id', 'created_at', 'last_updated', 'enrollment_date']
    inlines = [FaceImageInline]
    
    fieldsets = (
        ('User Information', {
            'fields': ('id', 'user')
        }),
        ('Enrollment Status', {
            'fields': ('is_complete', 'enrollment_date', 'last_updated')
        }),
        ('Quality Metrics', {
            'fields': ('quality_score', 'confidence_score')
        }),
        ('Embeddings', {
            'fields': ('insightface_embedding', 'deepface_embedding', 'dlib_embedding'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )


class FaceImageAdminForm(forms.ModelForm):
    """Custom form for FaceImage to handle djongo ForeignKey validation issues."""
    
    class Meta:
        model = FaceImage
        fields = '__all__'
    
    def _post_clean(self):
        """Override to skip model validation that triggers djongo issues."""
        for field_name, value in self.cleaned_data.items():
            setattr(self.instance, field_name, value)


@admin.register(FaceImage)
class FaceImageAdmin(admin.ModelAdmin):
    """Admin for FaceImage."""
    
    form = FaceImageAdminForm
    list_display = ['face_data', 'angle', 'face_detected', 'detection_confidence', 'brightness', 'sharpness', 'captured_at']
    list_filter = ['angle', 'face_detected', 'captured_at']
    search_fields = ['face_data__user__email']
    readonly_fields = ['id', 'brightness', 'sharpness', 'face_detected', 'detection_confidence', 'captured_at']
    
    fieldsets = (
        ('Face Information', {
            'fields': ('id', 'face_data', 'angle', 'image')
        }),
        ('Quality Metrics', {
            'fields': ('face_detected', 'detection_confidence', 'brightness', 'sharpness')
        }),
        ('Timestamp', {
            'fields': ('captured_at',)
        }),
    )


class RecognitionLogAdminForm(forms.ModelForm):
    """Custom form for RecognitionLog to handle djongo ForeignKey validation issues."""
    
    class Meta:
        model = RecognitionLog
        fields = '__all__'
    
    def _post_clean(self):
        """Override to skip model validation that triggers djongo issues."""
        for field_name, value in self.cleaned_data.items():
            setattr(self.instance, field_name, value)


@admin.register(RecognitionLog)
class RecognitionLogAdmin(admin.ModelAdmin):
    """Admin for RecognitionLog."""
    
    form = RecognitionLogAdminForm
    list_display = ['recognized_user', 'status', 'confidence_score', 'ip_address', 'timestamp']
    list_filter = ['status', 'timestamp']
    search_fields = ['recognized_user__email', 'ip_address']
    readonly_fields = [
        'id', 'recognized_user', 'status', 'confidence_score',
        'insightface_result', 'deepface_result', 'dlib_result',
        'ip_address', 'user_agent', 'timestamp'
    ]
    
    fieldsets = (
        ('Recognition Details', {
            'fields': ('id', 'recognized_user', 'status', 'confidence_score')
        }),
        ('Model Results', {
            'fields': ('insightface_result', 'deepface_result', 'dlib_result'),
            'classes': ('collapse',)
        }),
        ('Request Information', {
            'fields': ('ip_address', 'user_agent')
        }),
        ('Timestamp', {
            'fields': ('timestamp',)
        }),
    )
    
    def has_add_permission(self, request):
        """Logs are created automatically."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Logs are read-only."""
        return False


@admin.register(FaceRecognitionSettings)
class FaceRecognitionSettingsAdmin(admin.ModelAdmin):
    """Admin for FaceRecognitionSettings."""
    
    def has_add_permission(self, request):
        """Only one settings instance allowed."""
        # Use count() instead of exists() to avoid djongo recursion issues
        try:
            return FaceRecognitionSettings.objects.all().count() == 0
        except Exception:
            # If query fails, allow add (safer to allow than block)
            return True
    
    def has_delete_permission(self, request, obj=None):
        """Settings cannot be deleted."""
        return False
    
    fieldsets = (
        ('Thresholds', {
            'fields': ('min_confidence_threshold', 'quality_threshold')
        }),
        ('Model Weights', {
            'fields': ('insightface_weight', 'deepface_weight', 'dlib_weight'),
            'description': 'Weights must sum to 1.0'
        }),
        ('Features', {
            'fields': ('enable_liveness_detection', 'enable_anti_spoofing', 'log_all_attempts')
        }),
        ('Performance', {
            'fields': ('max_recognition_time', 'batch_processing')
        }),
        ('Metadata', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['updated_at']
