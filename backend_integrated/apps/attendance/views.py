"""
Attendance Views
Handles attendance marking and tracking
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from django.db import transaction
import logging

from .models import ClassSession, Attendance, AttendanceStatistics, AttendanceReport
from .serializers import (
    ClassSessionSerializer, AttendanceSerializer, MarkAttendanceSerializer,
    AttendanceStatisticsSerializer, AttendanceReportSerializer
)
from apps.face_recognition.services import FaceRecognitionEngine
from apps.face_recognition.models import FaceData, RecognitionLog

logger = logging.getLogger(__name__)


class ClassSessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing class sessions.
    """
    serializer_class = ClassSessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter sessions based on user role."""
        user = self.request.user
        
        if user.role == 'admin':
            return ClassSession.objects.all().select_related('subject', 'faculty')
        elif user.role == 'hod':
            # HOD sees all sessions in their department
            return ClassSession.objects.filter(
                subject__department=user.department
            ).select_related('subject', 'faculty')
        elif user.role == 'faculty':
            # Faculty sees their own sessions
            return ClassSession.objects.filter(
                faculty=user
            ).select_related('subject', 'faculty')
        else:
            # Students see sessions for their enrolled subjects
            return ClassSession.objects.filter(
                subject__enrolled_students=user
            ).select_related('subject', 'faculty')
    
    @action(detail=True, methods=['post'])
    def start_session(self, request, pk=None):
        """
        Start a class session.
        POST /api/attendance/sessions/{id}/start_session/
        """
        session = self.get_object()
        
        if session.faculty != request.user and request.user.role != 'admin':
            return Response({
                'error': 'Only the assigned faculty can start this session'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if session.status != 'scheduled':
            return Response({
                'error': f'Session is already {session.status}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        session.status = 'ongoing'
        session.actual_start_time = timezone.now()
        session.save()
        
        serializer = self.get_serializer(session)
        return Response({
            'success': True,
            'message': 'Session started successfully',
            'session': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def end_session(self, request, pk=None):
        """
        End a class session.
        POST /api/attendance/sessions/{id}/end_session/
        """
        session = self.get_object()
        
        if session.faculty != request.user and request.user.role != 'admin':
            return Response({
                'error': 'Only the assigned faculty can end this session'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if session.status != 'ongoing':
            return Response({
                'error': f'Session is not ongoing (status: {session.status})'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        session.status = 'completed'
        session.actual_end_time = timezone.now()
        session.save()
        
        # Mark absent students
        enrolled_students = session.subject.enrolled_students.all()
        marked_students = session.attendance_records.values_list('student_id', flat=True)
        
        absent_students = enrolled_students.exclude(id__in=marked_students)
        
        for student in absent_students:
            Attendance.objects.create(
                session=session,
                student=student,
                status='absent',
                marking_method='auto',
                marked_by=request.user
            )
        
        serializer = self.get_serializer(session)
        return Response({
            'success': True,
            'message': 'Session ended successfully',
            'absent_marked': absent_students.count(),
            'session': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """
        Get today's sessions.
        GET /api/attendance/sessions/today/
        """
        today = timezone.now().date()
        queryset = self.get_queryset().filter(scheduled_date=today)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AttendanceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for attendance records.
    """
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter attendance based on user role."""
        user = self.request.user
        
        if user.role == 'admin':
            return Attendance.objects.all().select_related('session', 'student', 'marked_by')
        elif user.role == 'hod':
            return Attendance.objects.filter(
                session__subject__department=user.department
            ).select_related('session', 'student', 'marked_by')
        elif user.role == 'faculty':
            return Attendance.objects.filter(
                session__faculty=user
            ).select_related('session', 'student', 'marked_by')
        else:
            # Students see only their own attendance
            return Attendance.objects.filter(
                student=user
            ).select_related('session', 'student', 'marked_by')
    
    @action(detail=False, methods=['post'])
    def mark_via_face(self, request):
        """
        Mark attendance using face recognition.
        POST /api/attendance/attendance/mark_via_face/
        Body: {session_id: uuid, image: file}
        """
        serializer = MarkAttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        session_id = serializer.validated_data['session_id']
        image_file = serializer.validated_data['image']
        
        try:
            session = ClassSession.objects.get(id=session_id)
        except ClassSession.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Session not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if not session.can_mark_attendance:
            return Response({
                'success': False,
                'error': 'Attendance marking window has closed'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if student is enrolled
        if request.user not in session.subject.enrolled_students.all():
            return Response({
                'success': False,
                'error': 'You are not enrolled in this subject'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check if already marked
        existing = Attendance.objects.filter(session=session, student=request.user).first()
        if existing:
            return Response({
                'success': False,
                'error': f'Attendance already marked as {existing.get_status_display()}',
                'attendance': AttendanceSerializer(existing).data
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Perform face recognition
        image_data = image_file.read()
        face_engine = FaceRecognitionEngine()
        
        try:
            # Get student's enrolled face data
            face_data = FaceData.objects.get(user=request.user, is_complete=True)
            
            enrolled_embeddings = {
                'insightface': face_data.insightface_embedding,
                'deepface': face_data.deepface_embedding,
                'dlib': face_data.dlib_embedding
            }
            
            recognition_result = face_engine.recognize_face(image_data, enrolled_embeddings)
            
            if not recognition_result.get('recognized'):
                # Log failed recognition
                log = RecognitionLog.objects.create(
                    recognized_user=None,
                    status='low_confidence',
                    confidence_score=recognition_result.get('confidence', 0),
                    ip_address=request.META.get('REMOTE_ADDR'),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
                
                return Response({
                    'success': False,
                    'error': 'Face recognition failed',
                    'confidence': recognition_result.get('confidence', 0),
                    'message': 'Please try again or contact faculty for manual marking'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Log successful recognition
            log = RecognitionLog.objects.create(
                recognized_user=request.user,
                status='success',
                confidence_score=recognition_result['confidence'],
                insightface_result=recognition_result.get('similarities'),
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            # Mark attendance
            with transaction.atomic():
                attendance = Attendance.objects.create(
                    session=session,
                    student=request.user,
                    status='present',
                    marking_method='face',
                    marked_at=timezone.now(),
                    recognition_confidence=recognition_result['confidence'],
                    recognition_log=log,
                    ip_address=request.META.get('REMOTE_ADDR'),
                    location_verified=True
                )
                
                # Update statistics
                stats, created = AttendanceStatistics.objects.get_or_create(
                    student=request.user,
                    subject=session.subject
                )
                stats.update_statistics()
            
            return Response({
                'success': True,
                'message': 'Attendance marked successfully',
                'confidence': recognition_result['confidence'],
                'attendance': AttendanceSerializer(attendance).data
            }, status=status.HTTP_201_CREATED)
            
        except FaceData.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Face not enrolled. Please complete face registration first.'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Attendance marking error: {e}", exc_info=True)
            return Response({
                'success': False,
                'error': 'Failed to mark attendance',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def mark_manual(self, request):
        """
        Manually mark attendance (faculty only).
        POST /api/attendance/attendance/mark_manual/
        Body: {session_id: uuid, student_id: uuid, status: 'present/absent/late'}
        """
        if request.user.role not in ['faculty', 'admin', 'hod']:
            return Response({
                'error': 'Only faculty can manually mark attendance'
            }, status=status.HTTP_403_FORBIDDEN)
        
        session_id = request.data.get('session_id')
        student_id = request.data.get('student_id')
        att_status = request.data.get('status', 'present')
        
        try:
            session = ClassSession.objects.get(id=session_id)
            student = User.objects.get(id=student_id, role='student')
            
            # Check if faculty is authorized
            if request.user.role == 'faculty' and session.faculty != request.user:
                return Response({
                    'error': 'You can only mark attendance for your own sessions'
                }, status=status.HTTP_403_FORBIDDEN)
            
            attendance, created = Attendance.objects.update_or_create(
                session=session,
                student=student,
                defaults={
                    'status': att_status,
                    'marking_method': 'manual',
                    'marked_at': timezone.now(),
                    'marked_by': request.user,
                    'ip_address': request.META.get('REMOTE_ADDR')
                }
            )
            
            # Update statistics
            stats, _ = AttendanceStatistics.objects.get_or_create(
                student=student,
                subject=session.subject
            )
            stats.update_statistics()
            
            return Response({
                'success': True,
                'message': f'Attendance marked as {att_status}',
                'attendance': AttendanceSerializer(attendance).data
            }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
            
        except ClassSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Manual attendance error: {e}", exc_info=True)
            return Response({
                'error': 'Failed to mark attendance',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AttendanceStatisticsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for attendance statistics.
    """
    serializer_class = AttendanceStatisticsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter statistics based on user role."""
        user = self.request.user
        
        if user.role == 'admin':
            return AttendanceStatistics.objects.all().select_related('student', 'subject')
        elif user.role == 'hod':
            return AttendanceStatistics.objects.filter(
                subject__department=user.department
            ).select_related('student', 'subject')
        elif user.role == 'faculty':
            return AttendanceStatistics.objects.filter(
                Q(subject__primary_faculty=user) | Q(subject__additional_faculty=user)
            ).select_related('student', 'subject')
        else:
            # Students see only their own stats
            return AttendanceStatistics.objects.filter(
                student=user
            ).select_related('student', 'subject')
    
    @action(detail=False, methods=['get'])
    def my_stats(self, request):
        """
        Get current user's attendance statistics.
        GET /api/attendance/statistics/my_stats/
        """
        stats = AttendanceStatistics.objects.filter(
            student=request.user
        ).select_related('subject')
        
        serializer = self.get_serializer(stats, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def low_attendance(self, request):
        """
        Get students with low attendance.
        GET /api/attendance/statistics/low_attendance/
        """
        if request.user.role not in ['faculty', 'admin', 'hod']:
            return Response({
                'error': 'Unauthorized'
            }, status=status.HTTP_403_FORBIDDEN)
        
        queryset = self.get_queryset().filter(is_below_threshold=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
