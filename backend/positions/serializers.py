from rest_framework import serializers

from .models import Position


class PositionSerializer(serializers.ModelSerializer):

    election_name = serializers.CharField(
        source="election.title",
        read_only=True,
    )

    organization_name = serializers.CharField(
        source="election.organization.name",
        read_only=True,
    )


    class Meta:
        model = Position
        fields = ["id",
            "election",
            "election_name",

            "organization_name",

            "title",

            "description",

            "max_candidates",

            "max_votes_per_voter",

            "result_type",

            "display_order"]
            