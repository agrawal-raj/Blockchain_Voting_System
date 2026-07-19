from rest_framework import serializers


class DashboardSerializer(serializers.Serializer):

    organizations = serializers.IntegerField()

    total_elections = serializers.IntegerField()

    active_elections = serializers.IntegerField()

    completed_elections = serializers.IntegerField()

    upcoming_elections = serializers.IntegerField()

    positions = serializers.IntegerField()

    candidates = serializers.IntegerField()

    voters = serializers.IntegerField()

    votes = serializers.IntegerField()

    voting_percentage = serializers.FloatField()