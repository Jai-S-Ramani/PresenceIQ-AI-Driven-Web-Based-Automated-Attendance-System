"""
Email Service for PresenceIQ
Handles all email notifications including:
- Welcome emails
- Password reset
- Attendance notifications
- Report generation alerts
"""

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service class for handling email notifications."""
    
    @staticmethod
    def send_email(subject, template_name, context, recipient_list, from_email=None):
        """
        Send email using HTML template.
        
        Args:
            subject (str): Email subject
            template_name (str): Path to HTML template
            context (dict): Context data for template
            recipient_list (list): List of recipient email addresses
            from_email (str, optional): Sender email. Defaults to DEFAULT_FROM_EMAIL.
        
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Use default from email if not specified
            from_email = from_email or settings.DEFAULT_FROM_EMAIL
            
            # Render HTML content
            html_content = render_to_string(template_name, context)
            
            # Create plain text version
            text_content = strip_tags(html_content)
            
            # Create email
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=recipient_list
            )
            
            # Attach HTML version
            email.attach_alternative(html_content, "text/html")
            
            # Send email
            email.send(fail_silently=False)
            
            logger.info(f"Email sent successfully to {', '.join(recipient_list)}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False
    
    @classmethod
    def send_welcome_email(cls, user):
        """Send welcome email to new user."""
        subject = "Welcome to PresenceIQ!"
        template_name = "email/welcome.html"
        context = {
            'user': user,
            'site_name': 'PresenceIQ',
            'login_url': f"{settings.FRONTEND_URL}/login",
        }
        return cls.send_email(
            subject=subject,
            template_name=template_name,
            context=context,
            recipient_list=[user.email]
        )
    
    @classmethod
    def send_password_reset_email(cls, user, reset_token):
        """Send password reset email."""
        subject = "Password Reset - PresenceIQ"
        template_name = "email/password_reset.html"
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        context = {
            'user': user,
            'reset_url': reset_url,
            'site_name': 'PresenceIQ',
        }
        return cls.send_email(
            subject=subject,
            template_name=template_name,
            context=context,
            recipient_list=[user.email]
        )
    
    @classmethod
    def send_attendance_notification(cls, student, class_session, status):
        """Send attendance notification to student."""
        subject = f"Attendance Update - {class_session.subject.name}"
        template_name = "email/attendance_notification.html"
        context = {
            'student': student,
            'class_session': class_session,
            'status': status,
            'site_name': 'PresenceIQ',
            'dashboard_url': f"{settings.FRONTEND_URL}/student/dashboard",
        }
        return cls.send_email(
            subject=subject,
            template_name=template_name,
            context=context,
            recipient_list=[student.email]
        )
    
    @classmethod
    def send_low_attendance_alert(cls, student, subject, attendance_percentage):
        """Send low attendance alert to student."""
        subject_line = f"Low Attendance Alert - {subject.name}"
        template_name = "email/low_attendance_alert.html"
        context = {
            'student': student,
            'subject': subject,
            'attendance_percentage': attendance_percentage,
            'site_name': 'PresenceIQ',
            'dashboard_url': f"{settings.FRONTEND_URL}/student/dashboard",
        }
        return cls.send_email(
            subject=subject_line,
            template_name=template_name,
            context=context,
            recipient_list=[student.email]
        )
    
    @classmethod
    def send_report_generated_email(cls, user, report_type, report_url=None):
        """Send email when report is generated."""
        subject = f"Your {report_type} Report is Ready"
        template_name = "email/report_generated.html"
        context = {
            'user': user,
            'report_type': report_type,
            'report_url': report_url or f"{settings.FRONTEND_URL}/reports",
            'site_name': 'PresenceIQ',
        }
        return cls.send_email(
            subject=subject,
            template_name=template_name,
            context=context,
            recipient_list=[user.email]
        )
    
    @classmethod
    def send_face_registration_confirmation(cls, user):
        """Send confirmation email after face registration."""
        subject = "Face Registration Complete - PresenceIQ"
        template_name = "email/face_registration_complete.html"
        context = {
            'user': user,
            'site_name': 'PresenceIQ',
            'dashboard_url': f"{settings.FRONTEND_URL}/student/dashboard",
        }
        return cls.send_email(
            subject=subject,
            template_name=template_name,
            context=context,
            recipient_list=[user.email]
        )
    
    @classmethod
    def send_class_reminder(cls, teacher, class_session):
        """Send class reminder to teacher."""
        subject = f"Class Reminder - {class_session.subject.name}"
        template_name = "email/class_reminder.html"
        context = {
            'teacher': teacher,
            'class_session': class_session,
            'site_name': 'PresenceIQ',
            'dashboard_url': f"{settings.FRONTEND_URL}/teacher/dashboard",
        }
        return cls.send_email(
            subject=subject,
            template_name=template_name,
            context=context,
            recipient_list=[teacher.email]
        )
    
    @classmethod
    def send_bulk_email(cls, subject, template_name, context, recipient_list):
        """Send bulk email to multiple recipients."""
        return cls.send_email(
            subject=subject,
            template_name=template_name,
            context=context,
            recipient_list=recipient_list
        )


# Convenience function for quick email sending
def send_email(subject, message, recipient_list, html_message=None):
    """
    Quick email sending function.
    
    Args:
        subject (str): Email subject
        message (str): Plain text message
        recipient_list (list): List of recipient emails
        html_message (str, optional): HTML version of message
    
    Returns:
        bool: True if successful
    """
    try:
        email = EmailMultiAlternatives(
            subject=subject,
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=recipient_list
        )
        
        if html_message:
            email.attach_alternative(html_message, "text/html")
        
        email.send(fail_silently=False)
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False
