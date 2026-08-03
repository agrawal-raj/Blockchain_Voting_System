
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import VoteSerializer
from .services import VotingService
from drf_spectacular.utils import extend_schema
from elections.models import Election
from positions.models import Position
from candidates.models import Candidate

from .serializers import (
    AvailableElectionSerializer,
    PositionSerializer,
    CandidateVotingSerializer,
)


@extend_schema(
    summary="Cast Vote",
    description="Cast a vote for a candidate.",
    tags=["Voting"],
)
class CastVoteView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = VoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:

            vote = VotingService.cast_vote(
                request.user,
                serializer.validated_data["candidate"],
                request,
            )

            block = vote.block
            return Response(
                {
                    "success": True,
                    "message": "Vote cast successfully.",
                    "vote_id": str(vote.id),
                    "block_number": block.block_number,
                    "block_hash": block.current_hash,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {
                    "success": False,
                    "message": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class AvailableElectionListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        elections = Election.objects.filter(
            status=Election.Status.ACTIVE
        ).select_related("organization")

        serializer = AvailableElectionSerializer(
            elections,
            many=True,
        )

        return Response(serializer.data)


class ElectionDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        positions = Position.objects.filter(
            election_id=pk
        ).order_by("display_order")

        serializer = PositionSerializer(
            positions,
            many=True,
        )

        return Response(serializer.data)


class PositionCandidateListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        candidates = Candidate.objects.filter(
            position_id=pk,
            is_active=True,
        )

        serializer = CandidateVotingSerializer(
            candidates,
            many=True,
        )

        return Response(serializer.data)