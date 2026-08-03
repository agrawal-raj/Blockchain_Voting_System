from rest_framework import serializers
from elections.models import Election
from positions.models import Position
from candidates.models import Candidate

class VoteSerializer(serializers.Serializer):

    candidate = serializers.UUIDField()


class AvailableElectionSerializer(serializers.ModelSerializer):

    organization = serializers.CharField(
        source="organization.name",
        read_only=True
    )

    class Meta:
        model = Election
        fields = [
            "id",
            "title",
            "description",
            "organization",
            "start_date",
            "end_date",
            "status",
        ]


class PositionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Position
        fields = [
            "id",
            "title",
            "display_order",
        ]


class CandidateVotingSerializer(serializers.ModelSerializer):

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Candidate
        fields = [
            "id",
            "full_name",
            "designation",
            "photo",
            "election_symbol",
            "bio",
            "manifesto",
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"