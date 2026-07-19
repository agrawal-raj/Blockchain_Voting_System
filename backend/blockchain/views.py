from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import BlockchainBlock
from .serializers import BlockchainBlockSerializer
from .validators import BlockchainValidator


class BlockchainListView(generics.ListAPIView):

    queryset = BlockchainBlock.objects.select_related(
        "vote",
        "vote__candidate",
    )

    serializer_class = BlockchainBlockSerializer

    permission_classes = [IsAuthenticated]


class BlockchainDetailView(generics.RetrieveAPIView):

    queryset = BlockchainBlock.objects.select_related(
        "vote",
        "vote__candidate",
    )

    serializer_class = BlockchainBlockSerializer

    permission_classes = [IsAuthenticated]

    lookup_field = "block_number"


class BlockchainVerifyView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        valid = BlockchainValidator.verify()

        return Response(
            {
                "valid": valid,
                "total_blocks": BlockchainBlock.objects.count(),
            }
        )