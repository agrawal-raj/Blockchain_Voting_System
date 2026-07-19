from django.shortcuts import render
from audit.services import AuditService
from audit.models import AuditLog
# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Candidate
from .serializers import CandidateSerializer
from .permissions import IsAdminUser


class CandidateListCreateView(generics.ListCreateAPIView):

    serializer_class = CandidateSerializer
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

class CandidateDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Candidate.objects.select_related(
        "position",
        "position__election"
    )

    serializer_class = CandidateSerializer
    permission_classes = [IsAdminUser]