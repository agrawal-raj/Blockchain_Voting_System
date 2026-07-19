from rest_framework import serializers

from .models import BlockchainBlock


class BlockchainBlockSerializer(serializers.ModelSerializer):

    vote_id = serializers.UUIDField(
        source="vote.id",
        read_only=True,
    )

    candidate = serializers.CharField(
        source="vote.candidate",
        read_only=True,
    )

    class Meta:
        model = BlockchainBlock

        fields = (
            "id",
            "block_number",
            "vote_id",
            "candidate",
            "previous_hash",
            "current_hash",
            "merkle_root",
            "nonce",
            "created_at",
        )