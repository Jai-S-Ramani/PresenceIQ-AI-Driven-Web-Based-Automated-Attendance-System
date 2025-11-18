"""
Attendance Models
Handles attendance tracking and statistics
"""

from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from datetime import timedelta


class ClassSession(models.Model):
    """
    Represents a single class session.
    """
    
    SESSION_TYPE_CHOICES = [
        ('lecture', 'Lecture'),
        ('lab', 'Laboratory'),
        ('tutorial', 'Tutorial'),
        ('seminar', 'Seminar'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Class details
    subject = models.ForeignKey('academic.Subject', on_delete=models.CASCADE, related_name='sessions', db_constraint=False)
    faculty = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='taught_sessions', db_constraint=False)
    session_type = models.CharField(max_length=20, choices=SESSION_TYPE_CHOICES, default='lecture')
    
    # Timing
    scheduled_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    # Attendance settings
    attendance_window_minutes = models.IntegerField(default=15, help_text="Minutes after start time to mark attendance")
    allow_late_marking = models.BooleanField(default=True)
    
    # Metadata
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'class_sessions'
        verbose_name = 'Class Session'
        verbose_name_plural = 'Class Sessions'
        ordering = ['-scheduled_date', '-start_time']
        indexes = [
            models.Index(fields=['scheduled_date', 'start_time']),
            models.Index(fields=['status']),
            # faculty and subject indexes automatically created by ForeignKeys
        ]
    
    def __str__(self):
        return f"{self.subject.name} - {self.scheduled_date} {self.start_time}"
    
    @property
    def is_ongoing(self):
        """Check if session is currently ongoing."""
        now = timezone.now()
        if self.actual_start_time and not self.actual_end_time:
            return True
        if self.status == 'ongoing':
            return True
        return False
    
    @property
    def can_mark_attendance(self):
        """Check if attendance can be marked now."""
        if self.status not in ['ongoing', 'scheduled']:
            return False
        
        now = timezone.now()
        scheduled_datetime = timezone.make_aware(
            timezone.datetime.combine(self.scheduled_date, self.start_time)
        )
        
        # Can mark from start time to window minutes after
        window_end = scheduled_datetime + timedelta(minutes=self.attendance_window_minutes)
        
        if self.allow_late_marking:
            # Allow until actual end or scheduled end
            end_time = self.actual_end_time or timezone.make_aware(
                timezone.datetime.combine(self.scheduled_date, self.end_time)
            )
            return scheduled_datetime <= now <= end_time
        else:
            return scheduled_datetime <= now <= window_end
    
    @property
    def total_students(self):
        """Total students enrolled in the subject."""
        return self.subject.enrolled_students.count()
    
    @property
    def present_count(self):
        """Count of students marked present."""
        return self.attendance_records.filter(status='present').count()
    
    @property
    def absent_count(self):
        """Count of students marked absent."""
        return self.attendance_records.filter(status='absent').count()
    
    @property
    def attendance_percentage(self):
        """Calculate attendance percentage."""
        total = self.total_students
        if total == 0:
            return 0
        return (self.present_count / total) * 100


class Attendance(models.Model):
    """
    Individual attendance record for a student in a session.
    """
    
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused'),
    ]
    
    MARKING_METHOD_CHOICES = [
        ('face', 'Face Recognition'),
        ('manual', 'Manual'),
        ('qr', 'QR Code'),
        ('auto', 'Automatic'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Core fields
    session = models.ForeignKey(ClassSession, on_delete=models.CASCADE, related_name='attendance_records', db_constraint=False)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attendance_records', db_constraint=False)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='absent')
    marking_method = models.CharField(max_length=20, choices=MARKING_METHOD_CHOICES, default='manual')
    
    # Timing
    marked_at = models.DateTimeField(null=True, blank=True)
    marked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='marked_attendance', db_constraint=False)
    
    # Face recognition details
    recognition_confidence = models.FloatField(null=True, blank=True)
    recognition_log = models.ForeignKey(
        'face_recognition.RecognitionLog',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='attendance_records', db_constraint=False)
    
    # Location tracking
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    location_verified = models.BooleanField(default=False)
    
    # Notes
    remarks = models.TextField(blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance'
        verbose_name = 'Attendance Record'
        verbose_name_plural = 'Attendance Records'
        unique_together = [['session', 'student']]
        ordering = ['-created_at']
        indexes = [
            # session and student indexes automatically created by ForeignKeys
            models.Index(fields=['status']),
            models.Index(fields=['marked_at']),
        ]
    
    def __str__(self):
        return f"{self.student.email} - {self.session} - {self.get_status_display()}"
    
    @property
    def is_late(self):
        """Check if marked late."""
        if not self.marked_at or self.status != 'present':
            return False
        
        scheduled_datetime = timezone.make_aware(
            timezone.datetime.combine(
                self.session.scheduled_date,
                self.session.start_time
            )
        )
        
        # Late if marked more than 5 minutes after start
        return self.marked_at > (scheduled_datetime + timedelta(minutes=5))


class AttendanceStatistics(models.Model):
    """
    Aggregated attendance statistics for students.
    Updated periodically via background task.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attendance_stats', db_constraint=False)
    subject = models.ForeignKey('academic.Subject', on_delete=models.CASCADE, related_name='attendance_stats', db_constraint=False)
    
    # Counts
    total_sessions = models.IntegerField(default=0)
    present_count = models.IntegerField(default=0)
    absent_count = models.IntegerField(default=0)
    late_count = models.IntegerField(default=0)
    excused_count = models.IntegerField(default=0)
    
    # Percentages
    attendance_percentage = models.FloatField(default=0.0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Streak tracking
    current_streak = models.IntegerField(default=0, help_text="Current consecutive attendance streak")
    longest_streak = models.IntegerField(default=0, help_text="Longest consecutive attendance streak")
    
    # Status
    is_below_threshold = models.BooleanField(default=False, help_text="Below minimum attendance requirement")
    warning_sent = models.BooleanField(default=False)
    
    # Metadata
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'attendance_statistics'
        verbose_name = 'Attendance Statistics'
        verbose_name_plural = 'Attendance Statistics'
        unique_together = [['student', 'subject']]
        indexes = [
            # student and subject indexes automatically created by ForeignKeys
            models.Index(fields=['attendance_percentage']),
            models.Index(fields=['is_below_threshold']),
        ]
    
    def __str__(self):
        return f"{self.student.email} - {self.subject.name} - {self.attendance_percentage:.1f}%"
    
    def update_statistics(self):
        """Recalculate all statistics."""
        records = Attendance.objects.filter(
            student=self.student,
            session__subject=self.subject
        )
        
        self.total_sessions = records.count()
        self.present_count = records.filter(status='present').count()
        self.absent_count = records.filter(status='absent').count()
        self.late_count = records.filter(status='late').count()
        self.excused_count = records.filter(status='excused').count()
        
        if self.total_sessions > 0:
            self.attendance_percentage = (self.present_count / self.total_sessions) * 100
        else:
            self.attendance_percentage = 0
        
        # Check threshold (default 75%)
        threshold = getattr(settings, 'ATTENDANCE_THRESHOLD', 75)
        self.is_below_threshold = self.attendance_percentage < threshold
        
        # Calculate streaks
        self._calculate_streaks()
        
        self.save()
    
    def _calculate_streaks(self):
        """Calculate attendance streaks."""
        records = Attendance.objects.filter(
            student=self.student,
            session__subject=self.subject
        ).order_by('-session__scheduled_date', '-session__start_time')
        
        current = 0
        longest = 0
        temp_streak = 0
        
        for record in records:
            if record.status == 'present':
                temp_streak += 1
                if temp_streak > longest:
                    longest = temp_streak
            else:
                if current == 0:
                    current = temp_streak
                temp_streak = 0
        
        if current == 0:
            current = temp_streak
        
        self.current_streak = current
        self.longest_streak = longest


class AttendanceReport(models.Model):
    """
    Generated attendance reports.
    """
    
    REPORT_TYPE_CHOICES = [
        ('student', 'Student Report'),
        ('subject', 'Subject Report'),
        ('department', 'Department Report'),
        ('session', 'Session Report'),
    ]
    
    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Report details
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='pdf')
    
    # Filters
    start_date = models.DateField()
    end_date = models.DateField()
    subject = models.ForeignKey('academic.Subject', on_delete=models.SET_NULL, null=True, blank=True, db_constraint=False)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, db_constraint=False)
    
    # File
    file = models.FileField(upload_to='attendance_reports/', null=True, blank=True)
    file_size = models.IntegerField(default=0, help_text="File size in bytes")
    
    # Generation details
    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='generated_reports', db_constraint=False)
    generated_at = models.DateTimeField(auto_now_add=True)
    
    # Metadata
    records_count = models.IntegerField(default=0)
    processing_time = models.FloatField(default=0.0, help_text="Processing time in seconds")
    
    class Meta:
        db_table = 'attendance_reports'
        verbose_name = 'Attendance Report'
        verbose_name_plural = 'Attendance Reports'
        ordering = ['-generated_at']
        indexes = [
            models.Index(fields=['-generated_at']),
            models.Index(fields=['report_type']),
        ]
    
    def __str__(self):
        return f"{self.get_report_type_display()} - {self.generated_at}"
