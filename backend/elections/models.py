from django.db import models
from django.conf import settings

from common.models import BaseModel
from organizations.models import Organization

class Election(BaseModel):

    class ElectionType(models.TextChoices):
        CORPORATE = "CORPORATE", "Corporate"
        ACADEMIC = "ACADEMIC", "Academic"
        GOVERNMENT = "GOVERNMENT", "Government"
        SOCIETY = "SOCIETY", "Society / Association"
        NGO = "NGO", "NGO"
        CLUB = "CLUB", "Club"
        OTHER = "OTHER", "Other"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        ACTIVE = "ACTIVE", "Active"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    title = models.CharField(
        max_length=200
    )

    description = models.TextField()

    election_type = models.CharField(
        max_length=20,
        choices=ElectionType.choices,
        default=ElectionType.CORPORATE,
    )

    start_date = models.DateTimeField()

    end_date = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )

    is_result_published = models.BooleanField(
    default=False
    )

    result_published_at = models.DateTimeField(
    blank=True,
    null=True
    )
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="elections",
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="elections",
        
    )

    cancel_reason = models.TextField(
    blank=True,
    null=True

    )
    def __str__(self):
        return self.title
    