from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Organization
from .serializers import OrganizationSerializer
from .permissions import IsAdminUser

from audit.services import AuditService
from audit.models import AuditLog


class OrganizationListCreateView(
    generics.ListCreateAPIView
):

    queryset = Organization.objects.all()

    serializer_class = OrganizationSerializer

    def get_permissions(self):

        if self.request.method == "GET":
            return [IsAuthenticated()]

        return [IsAdminUser()]

    def perform_create(self, serializer):

        organization = serializer.save()

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.CREATE,
            module="Organization",
            description=f"Organization {organization.name} created.",
            request=self.request,
            object_id=str(organization.id),
        )


class OrganizationDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Organization.objects.all()

    serializer_class = OrganizationSerializer

    permission_classes = [IsAdminUser]