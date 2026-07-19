from rest_framework import serializers


class CandidateResultSerializer(serializers.Serializer):

    id = serializers.UUIDField()

    candidate = serializers.CharField()

    votes = serializers.IntegerField()

    percentage = serializers.FloatField()


class PositionResultSerializer(serializers.Serializer):

    position = serializers.CharField()

    total_votes = serializers.IntegerField()

    winner = CandidateResultSerializer(
        allow_null=True
    )

    candidates = CandidateResultSerializer(
        many=True
    )