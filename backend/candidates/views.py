from django.shortcuts import render
from audit.services import AuditService
from audit.models import AuditLog
# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Candidate
from .serializers import CandidateSerializer
from .permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from common.pagination import StandardResultsSetPagination
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework.parsers import (MultiPartParser,FormParser,)


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
class CandidateListCreateView(generics.ListCreateAPIView):

    serializer_class = CandidateSerializer
    parser_classes = [MultiPartParser, FormParser]
    def get_queryset(self):

        queryset = Candidate.objects.select_related(
            "position",
            "position__election",
            "position__election__organization",
        )

        organization = self.request.query_params.get("organization")
        election = self.request.query_params.get("election")
        position = self.request.query_params.get("position")

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
            return [IsAuthenticated()]

        return [IsAdminUser()]

    def perform_create(self, serializer):
        candidate = serializer.save()

        AuditService.log(
        user=self.request.user,
        action=AuditLog.Action.CREATE,
        module="Candidate",
        description=f"Candidate {candidate.first_name} {candidate.last_name} created.",
        request=self.request,
        object_id=str(candidate.id),
    )
    pagination_class = StandardResultsSetPagination

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
class CandidateDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Candidate.objects.select_related(
        "position",
        "position__election"
    )

    serializer_class = CandidateSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAdminUser]


    def perform_update(self, serializer):

        candidate = serializer.save()

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.UPDATE,
            module="Candidate",
            description=(
                f"Candidate '{candidate.first_name} "
                f"{candidate.last_name}' updated."
            ),
            request=self.request,
            object_id=str(candidate.id),
        )

    def perform_destroy(self, instance):

        candidate_name = f"{instance.first_name} {instance.last_name}"
        candidate_id = str(instance.id)

        instance.delete()

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.DELETE,
            module="Candidate",
            description=f"Candidate '{candidate_name}' deleted.",
            request=self.request,
            object_id=candidate_id,
        )