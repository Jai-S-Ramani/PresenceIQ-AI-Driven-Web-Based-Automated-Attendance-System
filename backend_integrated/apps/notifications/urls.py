"""
Notifications URL Configuration
"""

from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications_home(request):
    """Notifications endpoint."""
    return Response({
        'message': 'Notifications system',
        'note': 'Notification system coming soon!'
    })

urlpatterns = [
    path('', notifications_home, name='notifications-home'),
]
