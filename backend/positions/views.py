from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Position
from .serializers import PositionSerializer
from .permissions import IsAdminUser

from audit.services import AuditService
from audit.models import AuditLog


class PositionListCreateView(generics.ListCreateAPIView):

    serializer_class = PositionSerializer

    def get_queryset(self):

        queryset = Position.objects.select_related(
            "election",
            "election__organization"
        )

        election = self.request.query_params.get("election")

        if election:
            queryset = queryset.filter(
                election_id=election
            )

        return queryset.order_by("display_order")

    def get_permissions(self):

        if self.request.method == "GET":
            return [IsAuthenticated()]

        return [IsAdminUser()]

    def perform_create(self, serializer):

        position = serializer.save()

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.CREATE,
            module="Position",
            description=f"Position '{position.title}' created.",
            request=self.request,
            object_id=str(position.id),
        )


class PositionDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Position.objects.select_related(
        "election",
        "election__organization",
    )

    serializer_class = PositionSerializer

    permission_classes = [IsAdminUser]