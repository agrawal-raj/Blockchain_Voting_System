from django.conf import settings
from django.db import models

from common.models import BaseModel
from candidates.models import Candidate
from positions.models import Position
from elections.models import Election


class Vote(BaseModel):

    voter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="votes",
    )

    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        related_name="votes",
    )

    voted_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-voted_at"]

    def __str__(self):
        return (
            f"{self.voter.email} -> "
            f"{self.candidate.first_name} "
            f"{self.candidate.last_name}"
        )