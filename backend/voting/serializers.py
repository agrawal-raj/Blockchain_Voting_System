from rest_framework import serializers

from elections.models import Election
from positions.models import Position
from candidates.models import Candidate

from .models import Vote


class VoteSerializer(serializers.Serializer):

    candidate = serializers.UUIDField()


class AvailableElectionSerializer(serializers.ModelSerializer):

    organization = serializers.CharField(
        source="organization.name",
        read_only=True,
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


class VoteHistorySerializer(serializers.ModelSerializer):

    vote_id = serializers.UUIDField(
        source="id",
        read_only=True,
    )

    election = serializers.CharField(
        source="candidate.position.election.title",
        read_only=True,
    )

    organization = serializers.CharField(
        source="candidate.position.election.organization.name",
        read_only=True,
        allow_null=True,
    )

    position = serializers.CharField(
        source="candidate.position.title",
        read_only=True,
    )

    candidate = serializers.SerializerMethodField()

    class Meta:

        model = Vote

        fields = [
            "vote_id",
            "election",
            "organization",
            "position",
            "candidate",
            "voted_at",
        ]

        read_only_fields = fields

    def get_candidate(self, obj):

        return (
            f"{obj.candidate.first_name} "
            f"{obj.candidate.last_name}"
        )


class VoteVerificationSerializer(serializers.Serializer):

    verified = serializers.BooleanField()

    vote_id = serializers.UUIDField()

    election = serializers.CharField()

    organization = serializers.CharField(
        allow_null=True
    )

    position = serializers.CharField()

    candidate = serializers.CharField()

    voted_at = serializers.DateTimeField()

    block_number = serializers.IntegerField()

    block_hash = serializers.CharField()

    previous_hash = serializers.CharField()

    merkle_root = serializers.CharField()

    message = serializers.CharField()