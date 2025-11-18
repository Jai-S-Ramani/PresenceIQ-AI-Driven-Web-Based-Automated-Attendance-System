"""
Attendance Admin Configuration
"""

from django.contrib import admin
from django import forms
from .models import ClassSession, Attendance, AttendanceStatistics, AttendanceReport
from apps.authentication.models import User
from apps.academic.models import Subject


class ClassSessionAdminForm(forms.ModelForm):
    """Custom form for ClassSession to handle djongo ForeignKey validation issues."""
    
    class Meta:
        model = ClassSession
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Manually filter faculty users
        if 'faculty' in self.fields:
            self.fields['faculty'].queryset = User.objects.filter(role='faculty').order_by('first_name', 'last_name')
        # Subjects - show ALL subjects (djongo cannot handle WHERE clause on BooleanField without explicit = comparison)
        if 'subject' in self.fields:
            self.fields['subject'].queryset = Subject.objects.all().order_by('name')
    
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
        # Skip calling model.full_clean() to avoid ForeignKey validation
        # Just set the cleaned data on the instance without validation
        for field_name, value in self.cleaned_data.items():
            setattr(self.instance, field_name, value)


@admin.register(ClassSession)
class ClassSessionAdmin(admin.ModelAdmin):
    """Admin for ClassSession."""
    
    form = ClassSessionAdminForm
    list_display = ['subject', 'faculty', 'scheduled_date', 'start_time', 'status', 'present_count', 'attendance_percentage']
    list_filter = ['status', 'session_type', 'scheduled_date', 'subject__department']
    search_fields = ['subject__name', 'subject__code', 'faculty__email']
    readonly_fields = ['id', 'actual_start_time', 'actual_end_time', 'created_at', 'updated_at']
    # date_hierarchy = 'scheduled_date'  # Disabled - djongo doesn't support datetime_trunc_sql()
    
    fieldsets = (
        ('Session Details', {
            'fields': ('id', 'subject', 'faculty', 'session_type')
        }),
        ('Schedule', {
            'fields': ('scheduled_date', 'start_time', 'end_time', 'location')
        }),
        ('Actual Timing', {
            'fields': ('actual_start_time', 'actual_end_time', 'status')
        }),
        ('Attendance Settings', {
            'fields': ('attendance_window_minutes', 'allow_late_marking')
        }),
        ('Additional Info', {
            'fields': ('description',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class AttendanceAdminForm(forms.ModelForm):
    """Custom form for Attendance to handle djongo ForeignKey validation issues."""
    
    class Meta:
        model = Attendance
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Filter student users
        if 'student' in self.fields:
            self.fields['student'].queryset = User.objects.filter(role='student').order_by('first_name', 'last_name')
        # Filter marked_by to faculty/admin
        if 'marked_by' in self.fields:
            self.fields['marked_by'].queryset = User.objects.filter(role__in=['faculty', 'admin']).order_by('first_name', 'last_name')
    
    def _post_clean(self):
        """Override to skip model validation that triggers djongo issues."""
        # Skip calling model.full_clean() to avoid ForeignKey validation
        for field_name, value in self.cleaned_data.items():
            setattr(self.instance, field_name, value)


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    """Admin for Attendance."""
    
    form = AttendanceAdminForm
    list_display = ['student', 'session', 'status', 'marking_method', 'marked_at', 'recognition_confidence']
    list_filter = ['status', 'marking_method', 'marked_at', 'location_verified']
    search_fields = ['student__email', 'student__first_name', 'student__last_name', 'session__subject__name']
    readonly_fields = ['id', 'marked_at', 'created_at', 'updated_at']
    # date_hierarchy = 'marked_at'  # Disabled - djongo doesn't support datetime_trunc_sql()
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'session', 'student', 'status')
        }),
        ('Marking Details', {
            'fields': ('marking_method', 'marked_at', 'marked_by')
        }),
        ('Face Recognition', {
            'fields': ('recognition_confidence', 'recognition_log'),
            'classes': ('collapse',)
        }),
        ('Location', {
            'fields': ('ip_address', 'location_verified')
        }),
        ('Notes', {
            'fields': ('remarks',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class AttendanceStatisticsAdminForm(forms.ModelForm):
    """Custom form for AttendanceStatistics to handle djongo ForeignKey validation issues."""
    
    class Meta:
        model = AttendanceStatistics
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Don't filter querysets here - raw_id_fields used in admin
        # Filtering with is_active causes djongo WHERE clause issues with bare booleans
        pass
    
    def _post_clean(self):
        """Override to skip model validation that triggers djongo issues."""
        for field_name, value in self.cleaned_data.items():
            setattr(self.instance, field_name, value)


@admin.register(AttendanceStatistics)
class AttendanceStatisticsAdmin(admin.ModelAdmin):
    """Admin for AttendanceStatistics."""
    
    form = AttendanceStatisticsAdminForm
    list_display = ['student', 'subject', 'attendance_percentage', 'total_sessions', 'present_count', 'is_below_threshold']
    list_filter = ['is_below_threshold', 'warning_sent']  # Removed 'subject__department' to avoid JOIN
    search_fields = ['student__email', 'student__first_name', 'student__last_name', 'subject__name']
    raw_id_fields = ['student', 'subject']  # Use raw_id_fields to avoid dropdown queries
    readonly_fields = [
        'id', 'total_sessions', 'present_count', 'absent_count', 'late_count',
        'excused_count', 'attendance_percentage', 'current_streak', 'longest_streak',
        'last_updated'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'student', 'subject')
        }),
        ('Statistics', {
            'fields': (
                'total_sessions', 'present_count', 'absent_count',
                'late_count', 'excused_count', 'attendance_percentage'
            )
        }),
        ('Streaks', {
            'fields': ('current_streak', 'longest_streak')
        }),
        ('Status', {
            'fields': ('is_below_threshold', 'warning_sent')
        }),
        ('Metadata', {
            'fields': ('last_updated',)
        }),
    )
    
    actions = ['recalculate_statistics']
    
    def recalculate_statistics(self, request, queryset):
        """Recalculate statistics for selected records."""
        for stat in queryset:
            stat.update_statistics()
        self.message_user(request, f'Recalculated statistics for {queryset.count()} records')
    recalculate_statistics.short_description = 'Recalculate statistics'


class AttendanceReportAdminForm(forms.ModelForm):
    """Custom form for AttendanceReport to handle djongo ForeignKey validation issues."""
    
    class Meta:
        model = AttendanceReport
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Filter faculty/admin users for generated_by
        if 'generated_by' in self.fields:
            self.fields['generated_by'].queryset = User.objects.filter(
                role__in=['faculty', 'admin']
            ).order_by('first_name', 'last_name')
        # Filter active subjects
        if 'subject' in self.fields:
            self.fields['subject'].queryset = Subject.objects.filter(
                is_active=True
            ).order_by('name')
        # Filter student users
        if 'student' in self.fields:
            self.fields['student'].queryset = User.objects.filter(
                role='student'
            ).order_by('first_name', 'last_name')
    
    def _post_clean(self):
        """Override to skip model validation that triggers djongo issues."""
        for field_name, value in self.cleaned_data.items():
            setattr(self.instance, field_name, value)


@admin.register(AttendanceReport)
class AttendanceReportAdmin(admin.ModelAdmin):
    """Admin for AttendanceReport."""
    
    form = AttendanceReportAdminForm
    list_display = ['report_type', 'format', 'start_date', 'end_date', 'generated_by', 'generated_at', 'records_count']
    list_filter = ['report_type', 'format', 'generated_at']
    search_fields = ['generated_by__email', 'subject__name']
    readonly_fields = ['id', 'file', 'file_size', 'generated_at', 'records_count', 'processing_time']
    # date_hierarchy = 'generated_at'  # Disabled - djongo doesn't support datetime_trunc_sql()
    
    fieldsets = (
        ('Report Details', {
            'fields': ('id', 'report_type', 'format')
        }),
        ('Filters', {
            'fields': ('start_date', 'end_date', 'subject', 'student')
        }),
        ('File', {
            'fields': ('file', 'file_size')
        }),
        ('Generation Info', {
            'fields': ('generated_by', 'generated_at', 'records_count', 'processing_time')
        }),
    )
    
    def has_add_permission(self, request):
        """Reports are generated via API."""
        return False
