from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Position
from .serializers import PositionSerializer
from .permissions import IsAdminUser

from audit.services import AuditService
from audit.models import AuditLog
from drf_spectacular.utils import extend_schema, extend_schema_view



@extend_schema_view(
    get=extend_schema(
        summary="List Positions",
        description="Retrieve a list of all positions.",
        tags=["Positions"],
    ),

    post=extend_schema(
        summary="Create Position",
        description="Create a new position.",
        tags=["Positions"],
    ),

)
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
    
    filterset_fields = [
            "election",
        ]

    search_fields = [
            "title",
        ]

    ordering_fields = [
            "display_order",
            "title",
        ]


@extend_schema_view(
    get=extend_schema(
        summary="Get Position",
        description="Retrieve a single position.",
        tags=["Positions"],
    ),
    put=extend_schema(
        summary="Update Position",
        description="Update a position.",
        tags=["Positions"],
    ),
    patch=extend_schema(
        summary="Partially Update Position",
        description="Partially update a position.",
        tags=["Positions"],
    ),
    delete=extend_schema(
        summary="Delete Position",
        description="Delete a position.",
        tags=["Positions"],
    ),
)
class PositionDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Position.objects.select_related(
        "election",
        "election__organization",
    )

    serializer_class = PositionSerializer

    permission_classes = [IsAdminUser]


    def perform_update(self, serializer):

        position = serializer.save()

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.UPDATE,
            module="Position",
            description=f"Position '{position.title}' updated.",
            request=self.request,
            object_id=str(position.id),
        )

    def perform_destroy(self, instance):

        title = instance.title
        position_id = str(instance.id)

        instance.delete()

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.DELETE,
            module="Position",
            description=f"Position '{title}' deleted.",
            request=self.request,
            object_id=position_id,
        )