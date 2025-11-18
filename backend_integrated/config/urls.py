"""
URL configuration for PresenceIQ Integrated Backend.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework import permissions


def api_root(request):
    """Root API endpoint showing available URLs."""
    return JsonResponse({
        'message': 'Welcome to PresenceIQ Backend API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'health': '/api/health/',
            'authentication': '/api/auth/',
            'academic': '/api/academic/',
            'attendance': '/api/attendance/',
            'face_recognition': '/api/face/',
            'reports': '/api/reports/',
            'notifications': '/api/notifications/',
        },
        'documentation': {
            'admin_panel': 'http://127.0.0.1:8000/admin/',
            'api_docs': 'Coming soon',
        },
        'status': 'operational'
    })


urlpatterns = [
    # Root
    path('', api_root, name='api-root'),
    
    # Django Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/', include('api.v1.urls')),
    
    # Health check
    path('api/health/', include('core.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Django Debug Toolbar
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns

# Admin site customization
admin.site.site_header = "PresenceIQ Integrated Administration"
admin.site.site_title = "PresenceIQ Admin Portal"
admin.site.index_title = "Welcome to PresenceIQ Integrated Backend"
