import random
from django.utils import timezone

from common.services.email_service import EmailService


def generate_otp():

    return str(random.randint(100000, 999999))



def send_registration_otp(user):

    otp = generate_otp()

    user.otp = otp
    user.otp_created_at = timezone.now()

    user.save(
        update_fields=[
            "otp",
            "otp_created_at",
        ]
    )

    EmailService.send_otp(
        user.email,
        user.first_name,
        otp,
    )
    
    return otp