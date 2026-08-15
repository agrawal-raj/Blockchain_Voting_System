from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied

from .models import Election
from .serializers import ElectionSerializer
from .permissions import IsAdminUser

from audit.services import AuditService
from audit.models import AuditLog

from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
)

from common.pagination import StandardResultsSetPagination

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter


def rebuild_blockchain():
    """
    Rebuild the remaining blockchain chain after deleting
    an election, position, or candidate.

    This function recalculates:

    - block_number
    - previous_hash
    - merkle_root
    - current_hash

    for all remaining blockchain blocks.

    The caller should execute this inside transaction.atomic().
    """

    from blockchain.models import BlockchainBlock
    from blockchain.services import BlockchainService

    blocks = list(
        BlockchainBlock.objects
        .select_related("vote")
        .order_by("block_number")
    )

    previous_hash = "0" * 64

    for index, block in enumerate(blocks, start=1):

        merkle_root = (
            BlockchainService.generate_merkle_root(
                block.vote
            )
        )

        nonce = block.nonce

        block_data = (
            f"{index}"
            f"{previous_hash}"
            f"{merkle_root}"
            f"{block.vote.id}"
            f"{block.vote.voted_at.isoformat()}"
            f"{nonce}"
        )

        current_hash = (
            BlockchainService.generate_hash(
                block_data
            )
        )

        block.block_number = index
        block.previous_hash = previous_hash
        block.merkle_root = merkle_root
        block.current_hash = current_hash

        block.save(
            update_fields=[
                "block_number",
                "previous_hash",
                "merkle_root",
                "current_hash",
            ]
        )

        previous_hash = current_hash


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
class ElectionListCreateView(
    generics.ListCreateAPIView
):

    queryset = Election.objects.all().order_by(
        "-created_at"
    )

    serializer_class = ElectionSerializer

    permission_classes = [
        IsAdminUser
    ]

    pagination_class = (
        StandardResultsSetPagination
    )

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

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

    def perform_create(self, serializer):

        election = serializer.save(
            created_by=self.request.user
        )

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.CREATE,
            module="Election",
            description=(
                f'Election "{election.title}" created.'
            ),
            request=self.request,
            object_id=str(election.id),
        )


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
class ElectionDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Election.objects.all()

    serializer_class = ElectionSerializer

    permission_classes = [
        IsAdminUser
    ]

    def perform_update(self, serializer):

        election = self.get_object()

        if election.is_result_published:

            raise PermissionDenied(
                "Published election cannot be modified. "
                "You may delete the election if it is no "
                "longer required."
            )

        election = serializer.save()

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.UPDATE,
            module="Election",
            description=(
                f'Election "{election.title}" updated.'
            ),
            request=self.request,
            object_id=str(election.id),
        )

    def perform_destroy(self, instance):

        election_title = instance.title
        election_id = str(instance.id)

        with transaction.atomic():

            instance.delete()

            # Rebuild remaining blockchain blocks
            # because the deleted election may have
            # removed votes and blockchain blocks.
            rebuild_blockchain()

            AuditService.log(
                user=self.request.user,
                action=AuditLog.Action.DELETE,
                module="Election",
                description=(
                    f'Election "{election_title}" deleted '
                    f'and related data removed.'
                ),
                request=self.request,
                object_id=election_id,
            )


class PublishResultsView(APIView):

    permission_classes = [
        IsAdminUser
    ]

    def post(self, request, pk):

        election = get_object_or_404(
            Election,
            pk=pk
        )

        if election.status != Election.Status.COMPLETED:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Election is not completed."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if election.is_result_published:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Results are already published."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        from voting.models import Vote

        if not Vote.objects.filter(
            candidate__position__election=election
        ).exists():

            return Response(
                {
                    "success": False,
                    "message": "No votes found.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        election.is_result_published = True

        election.result_published_at = (
            timezone.now()
        )

        election.save(
            update_fields=[
                "is_result_published",
                "result_published_at",
            ]
        )

        AuditService.log(
            user=request.user,
            action=AuditLog.Action.PUBLISH_RESULTS,
            module="Election",
            description=(
                f'Results published for '
                f'"{election.title}".'
            ),
            request=request,
            object_id=str(election.id),
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Results published successfully."
                ),
            }
        )