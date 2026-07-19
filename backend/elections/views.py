from rest_framework import generics

from .models import Election
from .serializers import ElectionSerializer
from .permissions import IsAdminUser
from audit.services import AuditService
from audit.models import AuditLog

class ElectionListCreateView(generics.ListCreateAPIView):

    queryset = Election.objects.all().order_by("-created_at")
    serializer_class = ElectionSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_create(self, serializer):
        election = serializer.save(created_by=self.request.user)

        AuditService.log(
            user=self.request.user,
            action=AuditLog.Action.CREATE,
            module="Election",
            description=f"Created election {election.title}",
            request=self.request,
            object_id=str(election.id),
        )

class ElectionDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    permission_classes = [IsAdminUser]