from django.db import models

from common.models import BaseModel
from elections.models import Election


class Position(BaseModel):

    class ResultType(models.TextChoices):
        SINGLE = "SINGLE", "Single Winner"
        MULTIPLE = "MULTIPLE", "Multiple Winners"

    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name="positions",
    )

    title = models.CharField(
        max_length=150,
    )

    description = models.TextField(
        blank=True,
    )

    max_candidates = models.PositiveIntegerField(
        default=10,
    )

    max_votes_per_voter = models.PositiveIntegerField(
        default=1,
    )

    result_type = models.CharField(
        max_length=20,
        choices=ResultType.choices,
        default=ResultType.SINGLE,
    )

    display_order = models.PositiveIntegerField(
        default=1,
    )

    class Meta:
        ordering = ["display_order"]

    def __str__(self):
        return f"{self.election.title} - {self.title}"