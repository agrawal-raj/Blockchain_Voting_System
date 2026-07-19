from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
)

from django.db import models

from common.models import BaseModel
from .managers import UserManager


class User(BaseModel, AbstractBaseUser, PermissionsMixin):

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        VOTER = "VOTER", "Voter"

    first_name = models.CharField(
        max_length=100
    )

    last_name = models.CharField(
        max_length=100
    )

    email = models.EmailField(
        unique=True
    )

    student_id = models.CharField(
        max_length=30,
        unique=True
    )

    mobile_number = models.CharField(
        max_length=15
    )

    profile_image = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True,
    )

    otp = models.CharField(
        max_length=6,
        blank=True,
    )

    otp_created_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.VOTER
    )

    is_verified = models.BooleanField(
        default=False
    )

    is_staff = models.BooleanField(
        default=False
    )

    date_joined = models.DateTimeField(
        auto_now_add=True
    )

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
        "student_id",
    ]

    objects = UserManager()

    def __str__(self):
        return self.email