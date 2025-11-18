"""
URL Configuration for Authentication App
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'authentication'

urlpatterns = [
    # Authentication
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Info
    path('user/', views.CurrentUserView.as_view(), name='current_user'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    
    # Password Management
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
]
