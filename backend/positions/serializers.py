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
        fields = "__all__"