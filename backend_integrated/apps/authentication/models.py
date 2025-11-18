"""
User and Authentication Models
Combines features from both backend implementations
"""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
import uuid


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user."""
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model for PresenceIQ.
    Combines features from both backend implementations.
    Supports: Admin, HOD, Faculty, Student roles.
    """
    
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('hod', 'Head of Department'),
        ('faculty', 'Faculty/Teacher'),
        ('student', 'Student'),
    ]
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    # Primary Fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    # Role and Status
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    # Student Fields
    student_id = models.CharField(max_length=50, blank=True, null=True, db_index=True)
    enrollment_number = models.CharField(max_length=50, blank=True, null=True)
    department = models.ForeignKey('academic.Department', on_delete=models.SET_NULL, null=True, blank=True, related_name='students', db_constraint=False)
    year = models.IntegerField(blank=True, null=True)
    semester = models.IntegerField(blank=True, null=True)
    section = models.CharField(max_length=10, blank=True, null=True)
    
    # Faculty Fields
    employee_id = models.CharField(max_length=50, blank=True, null=True, db_index=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    
    # Face Recognition Status
    is_face_enrolled = models.BooleanField(default=False)
    face_registered_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['student_id']),
            models.Index(fields=['employee_id']),
            # Department index automatically created by ForeignKey
        ]
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    def get_full_name(self):
        """Return the user's full name."""
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_short_name(self):
        """Return the user's short name."""
        return self.first_name
    
    def clean(self):
        """Validate uniqueness for non-null student_id, enrollment_number, and employee_id."""
        from django.core.exceptions import ValidationError
        
        # Validate student_id uniqueness (only if not null)
        if self.student_id:
            existing = User.objects.filter(student_id=self.student_id).exclude(pk=self.pk)
            if existing.exists():
                raise ValidationError({'student_id': 'A user with this student ID already exists.'})
        
        # Validate enrollment_number uniqueness (only if not null)
        if self.enrollment_number:
            existing = User.objects.filter(enrollment_number=self.enrollment_number).exclude(pk=self.pk)
            if existing.exists():
                raise ValidationError({'enrollment_number': 'A user with this enrollment number already exists.'})
        
        # Validate employee_id uniqueness (only if not null)
        if self.employee_id:
            existing = User.objects.filter(employee_id=self.employee_id).exclude(pk=self.pk)
            if existing.exists():
                raise ValidationError({'employee_id': 'A user with this employee ID already exists.'})
    
    def save(self, *args, **kwargs):
        """Override save to auto-generate username from email."""
        if not self.username:
            self.username = self.email.split('@')[0]
        # Call clean() to validate before saving
        self.clean()
        super().save(*args, **kwargs)
