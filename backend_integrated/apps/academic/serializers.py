"""
Academic Serializers
"""

from rest_framework import serializers
from .models import Department, Subject, Timetable, Holiday


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for departments."""
    
    hod_name = serializers.SerializerMethodField()
    total_subjects = serializers.SerializerMethodField()
    total_students = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = [
            'id', 'name', 'code', 'description', 'hod', 'hod_name',
            'is_active', 'total_subjects', 'total_students',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_hod_name(self, obj):
        if obj.hod:
            return f"{obj.hod.first_name} {obj.hod.last_name}".strip() or obj.hod.email
        return None
    
    def get_total_subjects(self, obj):
        return obj.subjects.filter(is_active=True).count()
    
    def get_total_students(self, obj):
        from apps.authentication.models import User
        return User.objects.filter(role='student', department=obj).count()


class SubjectSerializer(serializers.ModelSerializer):
    """Serializer for subjects."""
    
    department_name = serializers.CharField(source='department.name', read_only=True)
    primary_faculty_name = serializers.SerializerMethodField()
    enrolled_count = serializers.ReadOnlyField()
    total_hours = serializers.ReadOnlyField()
    
    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'code', 'description', 'department', 'department_name',
            'semester', 'year', 'credits', 'lecture_hours', 'lab_hours',
            'total_hours', 'primary_faculty', 'primary_faculty_name',
            'additional_faculty', 'enrolled_students', 'enrolled_count',
            'min_attendance_percentage', 'is_active', 'academic_year',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_primary_faculty_name(self, obj):
        if obj.primary_faculty:
            return f"{obj.primary_faculty.first_name} {obj.primary_faculty.last_name}".strip()
        return None


class TimetableSerializer(serializers.ModelSerializer):
    """Serializer for timetable entries."""
    
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_code = serializers.CharField(source='subject.code', read_only=True)
    faculty_name = serializers.SerializerMethodField()
    day_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    duration_minutes = serializers.ReadOnlyField()
    
    class Meta:
        model = Timetable
        fields = [
            'id', 'subject', 'subject_name', 'subject_code', 'faculty',
            'faculty_name', 'day_of_week', 'day_display', 'start_time',
            'end_time', 'duration_minutes', 'room_number', 'building',
            'session_type', 'valid_from', 'valid_until', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_faculty_name(self, obj):
        return f"{obj.faculty.first_name} {obj.faculty.last_name}".strip() or obj.faculty.email


class HolidaySerializer(serializers.ModelSerializer):
    """Serializer for holidays."""
    
    department_name = serializers.CharField(source='department.name', read_only=True)
    type_display = serializers.CharField(source='get_holiday_type_display', read_only=True)
    
    class Meta:
        model = Holiday
        fields = [
            'id', 'name', 'holiday_type', 'type_display', 'start_date',
            'end_date', 'department', 'department_name', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
