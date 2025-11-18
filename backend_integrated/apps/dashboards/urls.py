"""
Dashboards URL Configuration
"""

from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_home(request):
    """Main dashboard endpoint."""
    user = request.user
    return Response({
        'message': f'Dashboard for {user.email}',
        'role': user.role if hasattr(user, 'role') else 'unknown',
        'note': 'Dashboard views coming soon!'
    })

urlpatterns = [
    path('', dashboard_home, name='dashboard-home'),
]
