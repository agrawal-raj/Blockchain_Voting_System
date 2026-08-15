from django.db import transaction

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Candidate
from .serializers import CandidateSerializer
from .permissions import IsAdminUser

from audit.services import AuditService
from audit.models import AuditLog

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from common.pagination import StandardResultsSetPagination

from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
)

from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)


def rebuild_blockchain():
    """
    Rebuild the remaining blockchain after a
    candidate is deleted.

    Deleting a candidate may delete:

        Candidate
            ↓
        Votes
            ↓
        Blockchain blocks

    The remaining chain must therefore be
    recalculated.
    """

    from blockchain.models import BlockchainBlock
    from blockchain.services import BlockchainService

    blocks = list(
        BlockchainBlock.objects
        .select_related("vote")
        .order_by("block_number")
    )

    previous_hash = "0" * 64

    for index, block in enumerate(
        blocks,
        start=1,
    ):

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
        summary="List Candidates",
        description="Retrieve a list of all candidates.",
        tags=["Candidates"],
    ),
    post=extend_schema(
        summary="Create Candidate",
        description="Create a new candidate.",
        tags=["Candidates"],
    ),
)
class CandidateListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = CandidateSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_queryset(self):

        queryset = Candidate.objects.select_related(
            "position",
            "position__election",
            "position__election__organization",
        )

        organization = (
            self.request.query_params.get(
                "organization"
            )
        )

        election = (
            self.request.query_params.get(
                "election"
            )
        )

        position = (
            self.request.query_params.get(
                "position"
            )
        )

        if organization:

            queryset = queryset.filter(
                position__election__organization_id=organization
            )

        if election:

            queryset = queryset.filter(
                position__election_id=election
            )

        if position:

            queryset = queryset.filter(
                position_id=position
            )

        return queryset

    def get_permissions(self):

        if self.request.method == "GET":
            return [
                IsAuthenticated()
            ]

        return [
            IsAdminUser()
        ]

    def perform_create(self, serializer):

        position = serializer.validated_data[
            "position"
        ]

        election = position.election

        if election.is_result_published:

            raise PermissionDenied(
                "Cannot create a candidate for a "
                "published election."
            )

        candidate = serializer.save()

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.CREATE,
            module="Candidate",
            description=(
                f"Candidate "
                f"{candidate.first_name} "
                f"{candidate.last_name} created."
            ),
            request=self.request,
            object_id=str(candidate.id),
        )

    pagination_class = (
        StandardResultsSetPagination
    )

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "position",
    ]

    search_fields = [
        "first_name",
        "last_name",
        "designation",
        "position__title",
        "position__election__title",
        "position__election__organization__name",
    ]

    ordering_fields = [
        "first_name",
        "last_name",
        "total_votes",
        "created_at",
    ]

    ordering = [
        "first_name",
    ]


@extend_schema_view(
    get=extend_schema(
        summary="Get Candidate",
        description="Retrieve a single candidate.",
        tags=["Candidates"],
    ),
    put=extend_schema(
        summary="Update Candidate",
        description="Update a candidate.",
        tags=["Candidates"],
    ),
    patch=extend_schema(
        summary="Partially Update Candidate",
        description="Partially update a candidate.",
        tags=["Candidates"],
    ),
    delete=extend_schema(
        summary="Delete Candidate",
        description="Delete a candidate.",
        tags=["Candidates"],
    ),
)
class CandidateDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Candidate.objects.select_related(
        "position",
        "position__election",
    )

    serializer_class = CandidateSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    permission_classes = [
        IsAdminUser
    ]

    def perform_update(self, serializer):

        candidate = self.get_object()

        if (
            candidate.position
            .election
            .is_result_published
        ):

            raise PermissionDenied(
                "Cannot modify a candidate belonging "
                "to a published election."
            )

        candidate = serializer.save()

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.UPDATE,
            module="Candidate",
            description=(
                f"Candidate "
                f"'{candidate.first_name} "
                f"{candidate.last_name}' updated."
            ),
            request=self.request,
            object_id=str(candidate.id),
        )

    def perform_destroy(self, instance):

        candidate_name = (
            f"{instance.first_name} "
            f"{instance.last_name}"
        )

        candidate_id = str(instance.id)

        with transaction.atomic():

            instance.delete()

            rebuild_blockchain()

            AuditService.log(
                user=self.request.user,
                action=AuditLog.Action.DELETE,
                module="Candidate",
                description=(
                    f"Candidate '{candidate_name}' "
                    f"deleted and related data removed."
                ),
                request=self.request,
                object_id=candidate_id,
            )