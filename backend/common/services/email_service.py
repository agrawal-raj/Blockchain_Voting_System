from django.core.mail import send_mail
from django.conf import settings


class EmailService:

    @staticmethod
    def send_otp(email, first_name, otp):

        subject = "OTP Verification - Blockchain Voting System"

        message = f"""
Hello {first_name},

Welcome to Blockchain Voting System.

Your OTP is:

{otp}

This OTP is valid for 10 minutes.

Do not share this OTP with anyone.

Regards,
Blockchain Voting System
"""

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )