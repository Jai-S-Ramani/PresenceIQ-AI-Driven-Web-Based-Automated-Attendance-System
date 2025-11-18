"""
Reports URL Configuration
"""

from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reports_home(request):
    """Reports endpoint."""
    return Response({
        'message': 'Reports system',
        'note': 'Report generation coming soon!'
    })

urlpatterns = [
    path('', reports_home, name='reports-home'),
]
