from rest_framework import serializers

from .models import Election


class ElectionSerializer(serializers.ModelSerializer):

    created_by_name = serializers.SerializerMethodField()

    organization_name = serializers.CharField(
        source="organization.name",
        read_only=True
    )

    class Meta:
        model = Election
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
        )

    def get_created_by_name(self, obj):
        return f"{obj.created_by.first_name} {obj.created_by.last_name}"