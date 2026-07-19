from django.db import models

from common.models import BaseModel
from positions.models import Position


class Candidate(BaseModel):

    class Gender(models.TextChoices):
        MALE = "MALE", "Male"
        FEMALE = "FEMALE", "Female"
        OTHER = "OTHER", "Other"

    position = models.ForeignKey(
        Position,
        on_delete=models.CASCADE,
        related_name="candidates",
    )

    first_name = models.CharField(
        max_length=100,
    )

    last_name = models.CharField(
        max_length=100,
    )

    gender = models.CharField(
        max_length=10,
        choices=Gender.choices,
    )

    designation = models.CharField(
        max_length=150,
        blank=True,
    )

    bio = models.TextField(
        blank=True,
    )

    photo = models.ImageField(
        upload_to="candidates/photos/",
        blank=True,
        null=True,
    )

    election_symbol = models.ImageField(
        upload_to="candidates/symbols/",
        blank=True,
        null=True,
    )

    manifesto = models.TextField(
        blank=True,
    )

    total_votes = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        ordering = ["first_name", "last_name"]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"