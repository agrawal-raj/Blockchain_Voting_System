from rest_framework import serializers


class VoteSerializer(serializers.Serializer):

    candidate = serializers.UUIDField()