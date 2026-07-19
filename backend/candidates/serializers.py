from rest_framework import serializers

from .models import Candidate


class CandidateSerializer(serializers.ModelSerializer):

    full_name = serializers.SerializerMethodField()
    position_name = serializers.CharField(
        source="position.title",
        read_only=True,
    )
    election_name = serializers.CharField(
        source="position.election.title",
        read_only=True,
    )
    organization_name = serializers.CharField(
        source="position.election.organization.name",
        read_only=True,
    )

    class Meta:
        model = Candidate
        fields = "__all__"

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"