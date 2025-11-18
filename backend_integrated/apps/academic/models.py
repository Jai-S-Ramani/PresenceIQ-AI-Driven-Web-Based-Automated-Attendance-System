"""
Academic Models
Handles subjects, classes, and academic structure
"""

from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
import uuid


class Department(models.Model):
    """
    Academic Department.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    
    # HOD - limit_choices_to removed to avoid djongo RecursionError
    hod = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='headed_department',
        db_constraint=False
    )
    
    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'departments'
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'
        ordering = ['name']
    
    def clean(self):
        """Validate HOD has correct role."""
        super().clean()
        # Validation is handled in admin form to avoid djongo query issues
        # See apps.academic.admin.DepartmentAdminForm for validation logic
        pass
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Subject(models.Model):
    """
    Academic Subject/Course.
    """
    
    SEMESTER_CHOICES = [
        (1, 'Semester 1'),
        (2, 'Semester 2'),
        (3, 'Semester 3'),
        (4, 'Semester 4'),
        (5, 'Semester 5'),
        (6, 'Semester 6'),
        (7, 'Semester 7'),
        (8, 'Semester 8'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic details
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    
    # Academic structure
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='subjects', db_constraint=False)
    semester = models.IntegerField(choices=SEMESTER_CHOICES, validators=[MinValueValidator(1), MaxValueValidator(8)])
    year = models.IntegerField(help_text="Academic year (e.g., 1 for First Year)")
    
    # Credits and hours
    credits = models.IntegerField(default=3, validators=[MinValueValidator(1), MaxValueValidator(10)])
    lecture_hours = models.IntegerField(default=3, help_text="Weekly lecture hours")
    lab_hours = models.IntegerField(default=0, help_text="Weekly lab hours")
    
    # Faculty - limit_choices_to removed to avoid djongo RecursionError
    primary_faculty = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='primary_subjects',
        db_constraint=False
    )
    additional_faculty = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name='additional_subjects'
    )
    
    # Students - limit_choices_to removed to avoid djongo RecursionError
    enrolled_students = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name='enrolled_subjects'
    )
    
    # Settings
    min_attendance_percentage = models.FloatField(
        default=75.0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Minimum attendance percentage required"
    )
    
    # Metadata
    is_active = models.BooleanField(default=True)
    academic_year = models.CharField(max_length=20, help_text="e.g., 2024-2025")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subjects'
        verbose_name = 'Subject'
        verbose_name_plural = 'Subjects'
        ordering = ['department', 'semester', 'name']
        indexes = [
            # Department index automatically created by ForeignKey, only add semester for composite
            models.Index(fields=['semester']),
            models.Index(fields=['code']),
            models.Index(fields=['is_active']),
        ]
    
    def clean(self):
        """Validate faculty has correct role."""
        super().clean()
        # Validation is handled in admin form to avoid djongo query issues
        # See apps.academic.admin.SubjectAdminForm for validation logic
        pass
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    @property
    def total_hours(self):
        """Calculate total weekly hours."""
        return self.lecture_hours + self.lab_hours
    
    @property
    def enrolled_count(self):
        """Count of enrolled students."""
        return self.enrolled_students.count()


class Timetable(models.Model):
    """
    Weekly timetable entries.
    """
    
    DAY_CHOICES = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Core details
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='timetable_entries', db_constraint=False)
    # Faculty - limit_choices_to removed to avoid djongo RecursionError
    faculty = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='timetable_entries',
        db_constraint=False
    )
    
    # Timing
    day_of_week = models.CharField(max_length=20, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    # Location
    room_number = models.CharField(max_length=50)
    building = models.CharField(max_length=100, blank=True)
    
    # Type
    session_type = models.CharField(
        max_length=20,
        choices=[
            ('lecture', 'Lecture'),
            ('lab', 'Laboratory'),
            ('tutorial', 'Tutorial'),
        ],
        default='lecture'
    )
    
    # Validity
    valid_from = models.DateField()
    valid_until = models.DateField()
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'timetable'
        verbose_name = 'Timetable Entry'
        verbose_name_plural = 'Timetable Entries'
        ordering = ['day_of_week', 'start_time']
        indexes = [
            # Subject and faculty indexes automatically created by ForeignKeys
            models.Index(fields=['day_of_week']),
            models.Index(fields=['is_active']),
        ]
    
    def clean(self):
        """Validate faculty has correct role and time range."""
        super().clean()
        # Validation is handled in admin form to avoid djongo query issues
        # See apps.academic.admin.TimetableAdminForm for validation logic
        pass
    
    def __str__(self):
        return f"{self.subject.code} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"
    
    @property
    def duration_minutes(self):
        """Calculate duration in minutes."""
        from datetime import datetime
        start = datetime.combine(datetime.today(), self.start_time)
        end = datetime.combine(datetime.today(), self.end_time)
        return int((end - start).total_seconds() / 60)


class Holiday(models.Model):
    """
    Academic holidays and non-working days.
    """
    
    TYPE_CHOICES = [
        ('public', 'Public Holiday'),
        ('academic', 'Academic Holiday'),
        ('exam', 'Examination Period'),
        ('vacation', 'Vacation'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=200)
    holiday_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='public')
    
    # Date range
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Scope
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='holidays',
        help_text="Leave blank for all departments",
        db_constraint=False
    )
    
    description = models.TextField(blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'holidays'
        verbose_name = 'Holiday'
        verbose_name_plural = 'Holidays'
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['start_date', 'end_date']),
            # Department index automatically created by ForeignKey
        ]
    
    def __str__(self):
        return f"{self.name} ({self.start_date} to {self.end_date})"
