"""
Attendance Serializers
"""

from rest_framework import serializers
from .models import ClassSession, Attendance, AttendanceStatistics, AttendanceReport
from apps.academic.models import Subject
from apps.authentication.models import User


class ClassSessionSerializer(serializers.ModelSerializer):
    """Serializer for class sessions."""
    
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_code = serializers.CharField(source='subject.code', read_only=True)
    faculty_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_ongoing = serializers.ReadOnlyField()
    can_mark_attendance = serializers.ReadOnlyField()
    present_count = serializers.ReadOnlyField()
    absent_count = serializers.ReadOnlyField()
    attendance_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = ClassSession
        fields = [
            'id', 'subject', 'subject_name', 'subject_code', 'faculty', 'faculty_name',
            'session_type', 'scheduled_date', 'start_time', 'end_time',
            'actual_start_time', 'actual_end_time', 'status', 'status_display',
            'attendance_window_minutes', 'allow_late_marking', 'description',
            'location', 'is_ongoing', 'can_mark_attendance', 'present_count',
            'absent_count', 'attendance_percentage', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'actual_start_time', 'actual_end_time', 'created_at', 'updated_at']
    
    def get_faculty_name(self, obj):
        return f"{obj.faculty.first_name} {obj.faculty.last_name}".strip() or obj.faculty.email


class AttendanceSerializer(serializers.ModelSerializer):
    """Serializer for attendance records."""
    
    student_name = serializers.SerializerMethodField()
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    session_details = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_late = serializers.ReadOnlyField()
    
    class Meta:
        model = Attendance
        fields = [
            'id', 'session', 'student', 'student_name', 'student_id',
            'status', 'status_display', 'marking_method', 'marked_at',
            'marked_by', 'recognition_confidence', 'ip_address',
            'location_verified', 'remarks', 'is_late', 'session_details',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'marked_at', 'created_at', 'updated_at']
    
    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}".strip() or obj.student.email
    
    def get_session_details(self, obj):
        return {
            'subject': obj.session.subject.name,
            'date': obj.session.scheduled_date,
            'time': obj.session.start_time
        }


class MarkAttendanceSerializer(serializers.Serializer):
    """Serializer for marking attendance via face recognition."""
    
    session_id = serializers.UUIDField()
    image = serializers.ImageField()
    
    def validate_session_id(self, value):
        """Validate session exists and can mark attendance."""
        try:
            session = ClassSession.objects.get(id=value)
            if not session.can_mark_attendance:
                raise serializers.ValidationError("Attendance marking window has closed for this session")
            return value
        except ClassSession.DoesNotExist:
            raise serializers.ValidationError("Session not found")


class AttendanceStatisticsSerializer(serializers.ModelSerializer):
    """Serializer for attendance statistics."""
    
    student_name = serializers.SerializerMethodField()
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    class Meta:
        model = AttendanceStatistics
        fields = [
            'id', 'student', 'student_name', 'subject', 'subject_name',
            'total_sessions', 'present_count', 'absent_count', 'late_count',
            'excused_count', 'attendance_percentage', 'current_streak',
            'longest_streak', 'is_below_threshold', 'warning_sent', 'last_updated'
        ]
        read_only_fields = fields
    
    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}".strip() or obj.student.email


class AttendanceReportSerializer(serializers.ModelSerializer):
    """Serializer for attendance reports."""
    
    generated_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AttendanceReport
        fields = [
            'id', 'report_type', 'format', 'start_date', 'end_date',
            'subject', 'student', 'file', 'file_size', 'generated_by',
            'generated_by_name', 'generated_at', 'records_count', 'processing_time'
        ]
        read_only_fields = ['id', 'file', 'file_size', 'generated_at', 'records_count', 'processing_time']
    
    def get_generated_by_name(self, obj):
        if obj.generated_by:
            return f"{obj.generated_by.first_name} {obj.generated_by.last_name}".strip() or obj.generated_by.email
        return None
