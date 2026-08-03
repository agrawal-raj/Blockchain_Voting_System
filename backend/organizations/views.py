from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Organization
from .serializers import OrganizationSerializer
from .permissions import IsAdminUser

from audit.services import AuditService
from audit.models import AuditLog
from drf_spectacular.utils import extend_schema, extend_schema_view


@extend_schema_view(

    get=extend_schema(
        summary="List Organizations",
        description="Returns all organizations available in the system.",
        tags=["Organizations"],
    ),

    post=extend_schema(
        summary="Create Organization",
        description="Creates a new organization. Only administrators can perform this action.",
        tags=["Organizations"],
    ),

)

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

    filterset_fields = []

    search_fields = [
        "name",
    ]

    ordering_fields = [
        "name",
        "created_at",
    ]


@extend_schema_view(

    get=extend_schema(
        summary="Get Organization",
        description="Retrieve a single organization by its ID.",
        tags=["Organizations"],
    ),

    put=extend_schema(
        summary="Update Organization",
        description="Update an existing organization.",
        tags=["Organizations"],
    ),

    patch=extend_schema(
        summary="Partially Update Organization",
        description="Update one or more fields of an organization.",
        tags=["Organizations"],
    ),

    delete=extend_schema(
        summary="Delete Organization",
        description="Delete an organization.",
        tags=["Organizations"],
    ),

)

class OrganizationDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Organization.objects.all()

    serializer_class = OrganizationSerializer

    permission_classes = [IsAdminUser]

    def perform_update(self, serializer):

        organization = serializer.save()

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.UPDATE,
            module="Organization",
            description=f"Organization {organization.name} updated.",
            request=self.request,
            object_id=str(organization.id),
        )

    def perform_destroy(self, instance):

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.DELETE,
            module="Organization",
            description=f"Organization {instance.name} deleted.",
            request=self.request,
            object_id=str(instance.id),
        )

        instance.delete()


