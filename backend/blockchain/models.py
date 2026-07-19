from django.db import models

from common.models import BaseModel
from voting.models import Vote


class BlockchainBlock(BaseModel):

    block_number = models.PositiveIntegerField(
        unique=True,
    )

    vote = models.OneToOneField(
        Vote,
        on_delete=models.CASCADE,
        related_name="block",
    )

    previous_hash = models.CharField(
        max_length=64,
    )

    current_hash = models.CharField(
        max_length=64,
        unique=True,
    )

    nonce = models.PositiveIntegerField(
        default=0,
    )

    merkle_root = models.CharField(
        max_length=64,
    )

    class Meta:
        ordering = [
            "block_number"
        ]

    def __str__(self):
        return f"Block #{self.block_number}"