
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import VoteSerializer
from .services import VotingService


class CastVoteView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = VoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:

            vote = VotingService.cast_vote(
                request.user,
                serializer.validated_data["candidate"],
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