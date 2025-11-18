"""
Face Recognition Serializers
"""

from rest_framework import serializers
from .models import FaceData, FaceImage, RecognitionLog, FaceRecognitionSettings


class FaceImageSerializer(serializers.ModelSerializer):
    """Serializer for individual face images."""
    
    angle_display = serializers.CharField(source='get_angle_display', read_only=True)
    
    class Meta:
        model = FaceImage
        fields = [
            'id', 'angle', 'angle_display', 'image', 'brightness',
            'sharpness', 'face_detected', 'detection_confidence', 'captured_at'
        ]
        read_only_fields = [
            'id', 'brightness', 'sharpness', 'face_detected',
            'detection_confidence', 'captured_at'
        ]


class FaceDataSerializer(serializers.ModelSerializer):
    """Serializer for face data with all images."""
    
    images = FaceImageSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    completion_percentage = serializers.ReadOnlyField()
    has_all_angles = serializers.ReadOnlyField()
    missing_angles = serializers.SerializerMethodField()
    
    class Meta:
        model = FaceData
        fields = [
            'id', 'user', 'user_email', 'user_name', 'is_complete',
            'enrollment_date', 'last_updated', 'quality_score',
            'confidence_score', 'images', 'completion_percentage',
            'has_all_angles', 'missing_angles', 'created_at'
        ]
        read_only_fields = [
            'id', 'is_complete', 'enrollment_date', 'last_updated',
            'quality_score', 'confidence_score', 'created_at'
        ]
    
    def get_user_name(self, obj):
        """Get user's full name."""
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.email
    
    def get_missing_angles(self, obj):
        """Get list of missing angles."""
        all_angles = ['center', 'up', 'down', 'left', 'right', 'up_left', 'up_right', 'down_left', 'down_right']
        captured_angles = list(obj.images.values_list('angle', flat=True))
        return [angle for angle in all_angles if angle not in captured_angles]


class FaceEnrollmentSerializer(serializers.Serializer):
    """Serializer for face enrollment (single angle)."""
    
    angle = serializers.ChoiceField(choices=FaceImage.ANGLE_CHOICES)
    image = serializers.ImageField()
    
    def validate_image(self, value):
        """Validate image file."""
        # Check file size (max 10MB)
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("Image file too large (max 10MB)")
        
        # Check file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError("Invalid image format. Use JPG or PNG")
        
        return value


class FaceRecognitionSerializer(serializers.Serializer):
    """Serializer for face recognition request."""
    
    image = serializers.ImageField()
    
    def validate_image(self, value):
        """Validate image file."""
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("Image file too large (max 10MB)")
        
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError("Invalid image format. Use JPG or PNG")
        
        return value


class RecognitionLogSerializer(serializers.ModelSerializer):
    """Serializer for recognition logs."""
    
    user_email = serializers.EmailField(source='recognized_user.email', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = RecognitionLog
        fields = [
            'id', 'recognized_user', 'user_email', 'status', 'status_display',
            'confidence_score', 'insightface_result', 'deepface_result',
            'dlib_result', 'ip_address', 'timestamp'
        ]
        read_only_fields = fields


class FaceRecognitionSettingsSerializer(serializers.ModelSerializer):
    """Serializer for face recognition settings."""
    
    class Meta:
        model = FaceRecognitionSettings
        fields = [
            'id', 'min_confidence_threshold', 'quality_threshold',
            'insightface_weight', 'deepface_weight', 'dlib_weight',
            'enable_liveness_detection', 'enable_anti_spoofing',
            'log_all_attempts', 'max_recognition_time', 'batch_processing',
            'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']
    
    def validate(self, data):
        """Validate weights sum to 1.0."""
        weights_sum = (
            data.get('insightface_weight', 0.4) +
            data.get('deepface_weight', 0.4) +
            data.get('dlib_weight', 0.2)
        )
        
        if abs(weights_sum - 1.0) > 0.01:
            raise serializers.ValidationError(
                "Model weights must sum to 1.0"
            )
        
        return data
