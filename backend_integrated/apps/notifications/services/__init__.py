"""
Notification Services Package
"""

from .email_service import EmailService, send_email

__all__ = ['EmailService', 'send_email']
