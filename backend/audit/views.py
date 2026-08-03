from rest_framework import generics

from .models import AuditLog
from .serializers import AuditLogSerializer
from dashboard.permissions import IsAdminOnly
from drf_spectacular.utils import extend_schema, extend_schema_view



@extend_schema_view(
    get=extend_schema(
        summary="List Audit Logs",
        description="Retrieve a list of all audit logs.",
        tags=["Audit"],
    ),
)
class AuditLogListView(generics.ListAPIView):

    serializer_class = AuditLogSerializer

    permission_classes = [
        IsAdminOnly
    ]

    queryset = AuditLog.objects.select_related(
        "user"
    )

    filterset_fields = [
    "module",
    "action",
    ]

    search_fields = [
        "description",
    ]

    ordering_fields = [
        "created_at",
    ]