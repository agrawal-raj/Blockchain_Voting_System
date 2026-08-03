from rest_framework import generics

from .models import Election
from .serializers import ElectionSerializer
from .permissions import IsAdminUser
from audit.services import AuditService
from audit.models import AuditLog
from drf_spectacular.utils import extend_schema, extend_schema_view
from common.pagination import StandardResultsSetPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

@extend_schema_view(
    get=extend_schema(
        summary="List Elections",
        description="Retrieve a list of all elections.",
        tags=["Elections"],
    ),
    post=extend_schema(
        summary="Create Election",
        description="Create a new election.",
        tags=["Elections"],
    ),
)
class ElectionListCreateView(generics.ListCreateAPIView):

    queryset = Election.objects.all().order_by("-created_at")
    serializer_class = ElectionSerializer
    permission_classes = [IsAdminUser]
    pagination_class = StandardResultsSetPagination

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    def perform_create(self, serializer):
        election = serializer.save(created_by=self.request.user)

        AuditService.log(
        user=self.request.user,
        action=AuditLog.Action.CREATE,
        module="Election",
        description=f'Election "{election.title}" created.',
        request=self.request,
        object_id=str(election.id),
    )
    filterset_fields = [
            "status",
            "organization",
            "election_type",
        ]

    search_fields = [
            "title",
            "description",
        ]

    ordering_fields = [
            "start_date",
            "end_date",
            "created_at",
        ]

@extend_schema_view(

    get=extend_schema(
        summary="Get Election",
        description="Retrieve a single election.",
        tags=["Elections"],
    ),

    put=extend_schema(
        summary="Update Election",
        description="Update an election.",
        tags=["Elections"],
    ),

    patch=extend_schema(
        summary="Partially Update Election",
        description="Partially update an election.",
        tags=["Elections"],
    ),

    delete=extend_schema(
        summary="Delete Election",
        description="Delete an election.",
        tags=["Elections"],
    ),

)
class ElectionDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    permission_classes = [IsAdminUser]

    def perform_update(self, serializer):

        election = serializer.save()

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.UPDATE,
            module="Election",
            description=f'Election "{election.title}" updated.',
            request=self.request,
            object_id=str(election.id),
        )

    def perform_destroy(self, instance):

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.DELETE,
            module="Election",
            description=f'Election "{instance.title}" deleted.',
            request=self.request,
            object_id=str(instance.id),
        )

        instance.delete()


class PublishResultsView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, pk):

        election = get_object_or_404(
            Election,
            pk=pk
        )

        if election.status != Election.Status.COMPLETED:
            return Response(
                {
                    "success": False,
                    "message": "Election is not completed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if election.is_result_published:
            return Response(
                {
                    "success": False,
                    "message": "Results are already published."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        from voting.models import Vote

        if not Vote.objects.filter(
            candidate__position__election=election
        ).exists():

            return Response(
                {
                    "success": False,
                    "message": "No votes found."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    
        election.is_result_published = True
        election.result_published_at = timezone.now()

        election.save(
            update_fields=[
                "is_result_published",
                "result_published_at"
            ]
        )

        AuditService.log(
            user=request.user,
            action=AuditLog.Action.PUBLISH_RESULTS,
            module="Election",
            description=f'Results published for "{election.title}".',
            request=request,
            object_id=str(election.id),
        )

        return Response(
            {
                "success": True,
                "message": "Results published successfully."
            }
        )