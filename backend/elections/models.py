from django.db import models
from django.conf import settings

from common.models import BaseModel
from organizations.models import Organization

class Election(BaseModel):

    class ElectionType(models.TextChoices):
        SCHOOL = "SCHOOL", "School Election"
        CLASS = "CLASS", "Class Election"
        HOUSE = "HOUSE", "House Election"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        ACTIVE = "ACTIVE", "Active"
        COMPLETED = "COMPLETED", "Completed"

    title = models.CharField(
        max_length=200
    )

    description = models.TextField()

    election_type = models.CharField(
        max_length=20,
        choices=ElectionType.choices,
        default=ElectionType.SCHOOL,
    )

    start_date = models.DateTimeField()

    end_date = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
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

    def __str__(self):
        return self.title