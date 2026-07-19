from django.db import models

from common.models import BaseModel


class Organization(BaseModel):

    class OrganizationType(models.TextChoices):
        SCHOOL = "SCHOOL", "School"
        COLLEGE = "COLLEGE", "College"
        COMPANY = "COMPANY", "Company"
        SOCIETY = "SOCIETY", "Society"
        CLUB = "CLUB", "Club"
        GOVERNMENT = "GOVERNMENT", "Government"
        OTHER = "OTHER", "Other"

    name = models.CharField(
        max_length=255,
        unique=True,
    )

    organization_type = models.CharField(
        max_length=30,
        choices=OrganizationType.choices,
        default=OrganizationType.OTHER,
    )

    email = models.EmailField(
        blank=True,
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    address = models.TextField(
        blank=True,
    )

    logo = models.ImageField(
        upload_to="organizations/logos/",
        blank=True,
        null=True,
    )

    website = models.URLField(
        blank=True,
    )

    def __str__(self):
        return self.name