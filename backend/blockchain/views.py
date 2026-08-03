from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from audit.models import AuditLog
from audit.services import AuditService

from .models import BlockchainBlock
from .serializers import BlockchainBlockSerializer
from .validators import BlockchainValidator
from drf_spectacular.utils import extend_schema



@extend_schema(
    summary="List Blockchain Blocks",
    description="Retrieve a list of all blockchain blocks.",
    tags=["Blockchain"],
)
class BlockchainListView(generics.ListAPIView):

    queryset = BlockchainBlock.objects.select_related(
        "vote",
        "vote__candidate",
    )

    serializer_class = BlockchainBlockSerializer

    permission_classes = [IsAuthenticated]


@extend_schema(
    summary="Get Blockchain Block",
    description="Retrieve a single blockchain block.",
    tags=["Blockchain"],
)
class BlockchainDetailView(generics.RetrieveAPIView):

    queryset = BlockchainBlock.objects.select_related(
        "vote",
        "vote__candidate",
    )

    serializer_class = BlockchainBlockSerializer

    permission_classes = [IsAuthenticated]

    lookup_field = "block_number"


@extend_schema(
    summary="Verify Blockchain",
    description="Verify the integrity of the blockchain.",
    tags=["Blockchain"],
)
class BlockchainVerifyView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        valid = BlockchainValidator.verify()

        AuditService.log(
            user=request.user,
            action=AuditLog.Action.VERIFY,
            module="Blockchain",
            description=(
                "Blockchain verified successfully."
                if valid
                else "Blockchain verification failed."
            ),
            request=request,
        )
        return Response(
            {
                "valid": valid,
                "total_blocks": BlockchainBlock.objects.count(),
            }
        )