"""
Academic Admin Configuration
"""

from django import forms
from django.contrib import admin
from .models import Department, Subject, Timetable, Holiday
from apps.authentication.models import User


class DepartmentAdminForm(forms.ModelForm):
    """Custom form for Department to avoid djongo query issues."""
    
    class Meta:
        model = Department
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Manually filter HOD users without using limit_choices_to
        if 'hod' in self.fields:
            self.fields['hod'].queryset = User.objects.filter(role='hod').order_by('first_name', 'last_name')
    
    def _post_clean(self):
        """Override to skip model validation that triggers djongo issues."""
        # Skip calling model.full_clean() to avoid ForeignKey validation
        # which triggers database queries that djongo cannot handle
        
        # Just set the cleaned data on the instance without validation
        for field_name, value in self.cleaned_data.items():
            setattr(self.instance, field_name, value)
    



@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    """Admin for Department."""
    
    form = DepartmentAdminForm
    list_display = ['code', 'name', 'hod', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'code']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'code', 'description')
        }),
        ('HOD', {
            'fields': ('hod',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class SubjectAdminForm(forms.ModelForm):
    """Custom form for Subject to avoid djongo query issues."""
    
    class Meta:
        model = Subject
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Manually filter faculty users without using limit_choices_to
        if 'primary_faculty' in self.fields:
            self.fields['primary_faculty'].queryset = User.objects.filter(role='faculty').order_by('first_name', 'last_name')
        if 'additional_faculty' in self.fields:
            self.fields['additional_faculty'].queryset = User.objects.filter(role='faculty').order_by('first_name', 'last_name')
        if 'enrolled_students' in self.fields:
            self.fields['enrolled_students'].queryset = User.objects.filter(role='student').order_by('first_name', 'last_name')
    
    def _post_clean(self):
        """Override to skip model validation that triggers djongo issues."""
        # Set regular fields on the instance without validation
        # Store M2M fields separately - they can't be set with setattr
        for field_name, value in self.cleaned_data.items():
            try:
                field = self._meta.model._meta.get_field(field_name)
                if field.many_to_many:
                    # Skip M2M fields - Django admin will handle them after save
                    continue
            except:
                pass
            # Set regular fields directly
            setattr(self.instance, field_name, value)
    



@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    """Admin for Subject."""
    
    form = SubjectAdminForm
    list_display = ['code', 'name', 'department', 'semester', 'credits', 'primary_faculty', 'is_active']
    list_filter = ['department', 'semester', 'year', 'is_active']
    search_fields = ['name', 'code']
    readonly_fields = ['id', 'created_at', 'updated_at']
    filter_horizontal = ['additional_faculty', 'enrolled_students']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'code', 'description')
        }),
        ('Academic Structure', {
            'fields': ('department', 'semester', 'year', 'academic_year')
        }),
        ('Credits and Hours', {
            'fields': ('credits', 'lecture_hours', 'lab_hours')
        }),
        ('Faculty', {
            'fields': ('primary_faculty', 'additional_faculty')
        }),
        ('Students', {
            'fields': ('enrolled_students',)
        }),
        ('Settings', {
            'fields': ('min_attendance_percentage', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class TimetableAdminForm(forms.ModelForm):
    """Custom form for Timetable to avoid djongo query issues."""
    
    class Meta:
        model = Timetable
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Manually filter faculty users without using limit_choices_to
        if 'faculty' in self.fields:
            self.fields['faculty'].queryset = User.objects.filter(role='faculty').order_by('first_name', 'last_name')
    
    def clean(self):
        """Validate time range."""
        cleaned_data = super().clean()
        start_time = cleaned_data.get('start_time')
        end_time = cleaned_data.get('end_time')
        
        if start_time and end_time and start_time >= end_time:
            raise forms.ValidationError('End time must be after start time.')
        
        return cleaned_data
    
    def _post_clean(self):
        """Override to skip model validation that triggers djongo issues."""
        # Just set the cleaned data on the instance without validation
        for field_name, value in self.cleaned_data.items():
            setattr(self.instance, field_name, value)


@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    """Admin for Timetable."""
    
    form = TimetableAdminForm
    list_display = ['subject', 'day_of_week', 'start_time', 'end_time', 'faculty', 'room_number', 'is_active']
    list_filter = ['day_of_week', 'session_type', 'is_active', 'subject__department']
    search_fields = ['subject__name', 'subject__code', 'faculty__email', 'room_number']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'subject', 'faculty', 'session_type')
        }),
        ('Timing', {
            'fields': ('day_of_week', 'start_time', 'end_time')
        }),
        ('Location', {
            'fields': ('room_number', 'building')
        }),
        ('Validity', {
            'fields': ('valid_from', 'valid_until', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Holiday)
class HolidayAdmin(admin.ModelAdmin):
    """Admin for Holiday."""
    
    list_display = ['name', 'holiday_type', 'start_date', 'end_date', 'department']
    list_filter = ['holiday_type', 'department']
    search_fields = ['name', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'holiday_type', 'description')
        }),
        ('Date Range', {
            'fields': ('start_date', 'end_date')
        }),
        ('Scope', {
            'fields': ('department',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
