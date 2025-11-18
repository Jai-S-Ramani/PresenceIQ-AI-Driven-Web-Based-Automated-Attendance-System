"""
Core Views - Health check and utilities
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import connection


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint to verify the API is running.
    GET /api/health/
    """
    try:
        # Check database connection
        connection.ensure_connection()
        db_status = 'connected'
    except Exception as e:
        db_status = f'error: {str(e)}'
    
    return Response({
        'status': 'healthy',
        'message': 'PresenceIQ Integrated Backend is running',
        'database': db_status,
        'version': '1.0.0'
    })
