"""
Face Recognition Views
Handles face enrollment and recognition
"""

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import transaction
import logging

from .models import FaceData, FaceImage, RecognitionLog, FaceRecognitionSettings
from .serializers import (
    FaceDataSerializer, FaceImageSerializer, FaceEnrollmentSerializer,
    FaceRecognitionSerializer, RecognitionLogSerializer,
    FaceRecognitionSettingsSerializer
)
from .services import FaceRecognitionEngine

logger = logging.getLogger(__name__)


class FaceEnrollmentViewSet(viewsets.ViewSet):
    """
    ViewSet for face enrollment (9-angle capture).
    """
    permission_classes = [IsAuthenticated]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.face_engine = FaceRecognitionEngine()
    
    def list(self, request):
        """Get current user's face enrollment status."""
        try:
            face_data = FaceData.objects.prefetch_related('images').get(user=request.user)
            serializer = FaceDataSerializer(face_data)
            return Response(serializer.data)
        except FaceData.DoesNotExist:
            return Response({
                'message': 'No face data enrolled yet',
                'is_complete': False,
                'completion_percentage': 0,
                'missing_angles': ['center', 'up', 'down', 'left', 'right', 'up_left', 'up_right', 'down_left', 'down_right']
            })
    
    @action(detail=False, methods=['post'])
    def enroll_angle(self, request):
        """
        Enroll a single face angle.
        POST /api/face/enroll/enroll_angle/
        Body: {angle: "center", image: <file>}
        """
        serializer = FaceEnrollmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        angle = serializer.validated_data['angle']
        image_file = serializer.validated_data['image']
        
        # Read image data
        image_data = image_file.read()
        
        # Process with face recognition engine
        try:
            enrollment_result = self.face_engine.enroll_face(image_data, angle)
            
            if not enrollment_result['success']:
                return Response({
                    'success': False,
                    'error': enrollment_result.get('error', 'Enrollment failed'),
                    'details': enrollment_result
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get or create FaceData
            face_data, created = FaceData.objects.get_or_create(user=request.user)
            
            # Check if angle already exists
            existing_image = FaceImage.objects.filter(
                face_data=face_data,
                angle=angle
            ).first()
            
            if existing_image:
                # Delete old image
                existing_image.delete()
            
            # Create FaceImage
            with transaction.atomic():
                # Reset file pointer
                image_file.seek(0)
                
                face_image = FaceImage.objects.create(
                    face_data=face_data,
                    angle=angle,
                    image=image_file,
                    brightness=enrollment_result['quality_result']['brightness'],
                    sharpness=enrollment_result['quality_result']['sharpness'],
                    face_detected=True,
                    detection_confidence=enrollment_result['detection_result']['detections'][0]['confidence']
                )
                
                # Update FaceData embeddings (store best quality embedding for each model)
                if enrollment_result['embeddings'].get('insightface'):
                    if not face_data.insightface_embedding or angle == 'center':
                        face_data.insightface_embedding = enrollment_result['embeddings']['insightface']
                
                if enrollment_result['embeddings'].get('deepface'):
                    if not face_data.deepface_embedding or angle == 'center':
                        face_data.deepface_embedding = enrollment_result['embeddings']['deepface']
                
                if enrollment_result['embeddings'].get('dlib'):
                    if not face_data.dlib_embedding or angle == 'center':
                        face_data.dlib_embedding = enrollment_result['embeddings']['dlib']
                
                # Update quality scores
                face_data.quality_score = enrollment_result['quality_result']['quality_score']
                
                # Check if enrollment is complete (all 9 angles)
                if face_data.images.count() == 9:
                    face_data.is_complete = True
                    face_data.enrollment_date = timezone.now()
                    
                    # Update user's face enrollment status
                    request.user.is_face_enrolled = True
                    request.user.face_registered_at = timezone.now()
                    request.user.save(update_fields=['is_face_enrolled', 'face_registered_at'])
                
                face_data.save()
            
            # Return updated face data
            face_data.refresh_from_db()
            response_serializer = FaceDataSerializer(face_data)
            
            return Response({
                'success': True,
                'message': f'Face angle "{angle}" enrolled successfully',
                'face_data': response_serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Face enrollment error: {e}", exc_info=True)
            return Response({
                'success': False,
                'error': 'Internal server error during enrollment',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def complete_enrollment(self, request):
        """
        Complete enrollment process.
        POST /api/face/enroll/complete_enrollment/
        """
        try:
            face_data = FaceData.objects.prefetch_related('images').get(user=request.user)
            
            if face_data.has_all_angles:
                face_data.is_complete = True
                face_data.enrollment_date = timezone.now()
                face_data.save()
                
                # Update user
                request.user.is_face_enrolled = True
                request.user.face_registered_at = timezone.now()
                request.user.save(update_fields=['is_face_enrolled', 'face_registered_at'])
                
                return Response({
                    'success': True,
                    'message': 'Face enrollment completed successfully'
                })
            else:
                serializer = FaceDataSerializer(face_data)
                return Response({
                    'success': False,
                    'error': 'Not all angles captured',
                    'face_data': serializer.data
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except FaceData.DoesNotExist:
            return Response({
                'success': False,
                'error': 'No face data found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['delete'])
    def reset_enrollment(self, request):
        """
        Reset/delete all face data.
        DELETE /api/face/enroll/reset_enrollment/
        """
        try:
            face_data = FaceData.objects.get(user=request.user)
            face_data.delete()
            
            # Update user
            request.user.is_face_enrolled = False
            request.user.face_registered_at = None
            request.user.save(update_fields=['is_face_enrolled', 'face_registered_at'])
            
            return Response({
                'success': True,
                'message': 'Face enrollment reset successfully'
            })
        except FaceData.DoesNotExist:
            return Response({
                'success': True,
                'message': 'No face data to reset'
            })


class FaceRecognitionViewSet(viewsets.ViewSet):
    """
    ViewSet for face recognition.
    """
    permission_classes = [IsAuthenticated]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.face_engine = FaceRecognitionEngine()
    
    @action(detail=False, methods=['post'])
    def recognize(self, request):
        """
        Recognize face in image.
        POST /api/face/recognize/recognize/
        Body: {image: <file>}
        """
        serializer = FaceRecognitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        image_file = serializer.validated_data['image']
        image_data = image_file.read()
        
        try:
            # Get all enrolled users' face data
            all_face_data = FaceData.objects.filter(is_complete=True).select_related('user')
            
            if not all_face_data.exists():
                return Response({
                    'success': False,
                    'recognized': False,
                    'error': 'No enrolled faces in database'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            best_match = None
            best_confidence = 0
            
            # Compare with each enrolled user
            for face_data in all_face_data:
                enrolled_embeddings = {
                    'insightface': face_data.insightface_embedding,
                    'deepface': face_data.deepface_embedding,
                    'dlib': face_data.dlib_embedding
                }
                
                recognition_result = self.face_engine.recognize_face(image_data, enrolled_embeddings)
                
                if recognition_result.get('recognized') and recognition_result['confidence'] > best_confidence:
                    best_confidence = recognition_result['confidence']
                    best_match = {
                        'user': face_data.user,
                        'confidence': recognition_result['confidence'],
                        'similarities': recognition_result['similarities']
                    }
            
            # Log recognition attempt
            log_data = {
                'recognized_user': best_match['user'] if best_match else None,
                'status': 'success' if best_match else 'failed',
                'confidence_score': best_confidence,
                'ip_address': request.META.get('REMOTE_ADDR'),
                'user_agent': request.META.get('HTTP_USER_AGENT', '')
            }
            
            if best_match:
                log_data['insightface_result'] = best_match['similarities']
            
            RecognitionLog.objects.create(**log_data)
            
            if best_match:
                return Response({
                    'success': True,
                    'recognized': True,
                    'user': {
                        'id': str(best_match['user'].id),
                        'email': best_match['user'].email,
                        'name': f"{best_match['user'].first_name} {best_match['user'].last_name}".strip(),
                        'role': best_match['user'].role,
                        'student_id': best_match['user'].student_id,
                        'employee_id': best_match['user'].employee_id
                    },
                    'confidence': best_confidence,
                    'similarities': best_match['similarities']
                })
            else:
                return Response({
                    'success': True,
                    'recognized': False,
                    'message': 'Face not recognized',
                    'confidence': best_confidence
                })
                
        except Exception as e:
            logger.error(f"Face recognition error: {e}", exc_info=True)
            
            # Log failed attempt
            RecognitionLog.objects.create(
                status='failed',
                confidence_score=0,
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({
                'success': False,
                'error': 'Internal server error during recognition',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RecognitionLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing recognition logs.
    Admin only.
    """
    queryset = RecognitionLog.objects.all().select_related('recognized_user')
    serializer_class = RecognitionLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter logs based on user role."""
        user = self.request.user
        
        if user.role == 'admin':
            return RecognitionLog.objects.all().select_related('recognized_user')
        elif user.role in ['hod', 'faculty']:
            # Show logs for their department
            return RecognitionLog.objects.filter(
                recognized_user__department=user.department
            ).select_related('recognized_user')
        else:
            # Students see only their own logs
            return RecognitionLog.objects.filter(
                recognized_user=user
            )


class FaceRecognitionSettingsViewSet(viewsets.ViewSet):
    """
    ViewSet for face recognition settings.
    Admin only.
    """
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get current settings."""
        settings = FaceRecognitionSettings.get_settings()
        serializer = FaceRecognitionSettingsSerializer(settings)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        """Update settings."""
        if request.user.role != 'admin':
            return Response({
                'error': 'Only administrators can update settings'
            }, status=status.HTTP_403_FORBIDDEN)
        
        settings = FaceRecognitionSettings.get_settings()
        serializer = FaceRecognitionSettingsSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'success': True,
            'message': 'Settings updated successfully',
            'settings': serializer.data
        })
