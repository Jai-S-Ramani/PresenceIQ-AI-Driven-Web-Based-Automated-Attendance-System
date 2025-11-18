"""
Admin configuration for Authentication App
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model."""
    
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_active', 'is_face_enrolled']
    list_filter = ['role', 'is_active', 'is_verified', 'is_face_enrolled', 'department']
    search_fields = ['email', 'first_name', 'last_name', 'student_id', 'employee_id']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number', 'date_of_birth', 'gender', 'profile_picture', 'address')}),
        ('Role & Status', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'is_verified')}),
        ('Student Info', {'fields': ('student_id', 'enrollment_number', 'department', 'year', 'semester', 'section')}),
        ('Faculty Info', {'fields': ('employee_id', 'designation')}),
        ('Face Recognition', {'fields': ('is_face_enrolled', 'face_registered_at')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at', 'last_login')}),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_login', 'is_face_enrolled', 'face_registered_at']
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'role'),
        }),
    )
