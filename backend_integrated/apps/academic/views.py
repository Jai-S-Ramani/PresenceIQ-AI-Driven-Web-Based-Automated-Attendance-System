"""
Academic Views
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from datetime import date

from .models import Department, Subject, Timetable, Holiday
from .serializers import (
    DepartmentSerializer, SubjectSerializer,
    TimetableSerializer, HolidaySerializer
)


class DepartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for departments."""
    
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter based on user role."""
        user = self.request.user
        
        if user.role in ['admin']:
            return Department.objects.all()
        elif user.role == 'hod':
            return Department.objects.filter(Q(hod=user) | Q(id=user.department_id))
        else:
            return Department.objects.filter(is_active=True)


class SubjectViewSet(viewsets.ModelViewSet):
    """ViewSet for subjects."""
    
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter based on user role."""
        user = self.request.user
        
        if user.role == 'admin':
            return Subject.objects.all().select_related('department', 'primary_faculty')
        elif user.role == 'hod':
            return Subject.objects.filter(department=user.department).select_related('department', 'primary_faculty')
        elif user.role == 'faculty':
            return Subject.objects.filter(
                Q(primary_faculty=user) | Q(additional_faculty=user)
            ).distinct().select_related('department', 'primary_faculty')
        else:
            # Students see enrolled subjects
            return Subject.objects.filter(enrolled_students=user).select_related('department', 'primary_faculty')
    
    @action(detail=False, methods=['get'])
    def my_subjects(self, request):
        """Get current user's subjects."""
        user = request.user
        
        if user.role == 'student':
            subjects = Subject.objects.filter(enrolled_students=user)
        elif user.role == 'faculty':
            subjects = Subject.objects.filter(
                Q(primary_faculty=user) | Q(additional_faculty=user)
            ).distinct()
        else:
            subjects = Subject.objects.none()
        
        serializer = self.get_serializer(subjects, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def enroll_students(self, request, pk=None):
        """Enroll students in subject (HOD/Admin only)."""
        if request.user.role not in ['admin', 'hod']:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        subject = self.get_object()
        student_ids = request.data.get('student_ids', [])
        
        from apps.authentication.models import User
        students = User.objects.filter(id__in=student_ids, role='student')
        
        subject.enrolled_students.add(*students)
        
        return Response({
            'success': True,
            'message': f'Enrolled {students.count()} students',
            'enrolled_count': subject.enrolled_count
        })


class TimetableViewSet(viewsets.ModelViewSet):
    """ViewSet for timetable."""
    
    serializer_class = TimetableSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter based on user role."""
        user = self.request.user
        today = date.today()
        
        base_queryset = Timetable.objects.filter(
            is_active=True,
            valid_from__lte=today,
            valid_until__gte=today
        ).select_related('subject', 'faculty')
        
        if user.role == 'admin':
            return base_queryset
        elif user.role == 'hod':
            return base_queryset.filter(subject__department=user.department)
        elif user.role == 'faculty':
            return base_queryset.filter(faculty=user)
        else:
            # Students see timetable for enrolled subjects
            return base_queryset.filter(subject__enrolled_students=user)
    
    @action(detail=False, methods=['get'])
    def my_timetable(self, request):
        """Get current user's timetable."""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_day(self, request):
        """Get timetable for specific day."""
        day = request.query_params.get('day', None)
        
        if not day:
            return Response({'error': 'Day parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.get_queryset().filter(day_of_week=day.lower())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class HolidayViewSet(viewsets.ModelViewSet):
    """ViewSet for holidays."""
    
    serializer_class = HolidaySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter based on user role."""
        user = self.request.user
        
        if user.role == 'admin':
            return Holiday.objects.all()
        elif user.role in ['hod', 'faculty', 'student']:
            # Show department-specific and global holidays
            return Holiday.objects.filter(
                Q(department=user.department) | Q(department__isnull=True)
            )
        else:
            return Holiday.objects.filter(department__isnull=True)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming holidays."""
        today = date.today()
        holidays = self.get_queryset().filter(start_date__gte=today).order_by('start_date')[:10]
        serializer = self.get_serializer(holidays, many=True)
        return Response(serializer.data)
