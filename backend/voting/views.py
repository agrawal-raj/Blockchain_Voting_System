from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_spectacular.utils import extend_schema

from .models import Vote

from .serializers import (
    VoteSerializer,
    AvailableElectionSerializer,
    PositionSerializer,
    CandidateVotingSerializer,
    VoteHistorySerializer,
)

from .services import VotingService

from elections.models import Election
from positions.models import Position
from candidates.models import Candidate

from blockchain.models import BlockchainBlock
from blockchain.services import BlockchainService
from blockchain.validators import BlockchainValidator


@extend_schema(
    summary="Cast Vote",
    description="Cast a vote for a candidate.",
    tags=["Voting"],
)
class CastVoteView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = VoteSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

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


@extend_schema(
    summary="Available Elections",
    description=(
        "Return elections currently available "
        "for the authenticated voter."
    ),
    tags=["Voting"],
)
class AvailableElectionListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        elections = (
            Election.objects
            .filter(
                status=Election.Status.ACTIVE
            )
            .select_related("organization")
        )

        serializer = AvailableElectionSerializer(
            elections,
            many=True,
        )

        return Response(
            serializer.data
        )


@extend_schema(
    summary="Election Positions",
    description=(
        "Return positions belonging to an election."
    ),
    tags=["Voting"],
)
class ElectionDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        positions = (
            Position.objects
            .filter(
                election_id=pk
            )
            .order_by("display_order")
        )

        serializer = PositionSerializer(
            positions,
            many=True,
        )

        return Response(
            serializer.data
        )


@extend_schema(
    summary="Position Candidates",
    description=(
        "Return active candidates for a position."
    ),
    tags=["Voting"],
)
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

        return Response(
            serializer.data
        )


@extend_schema(
    summary="Vote History",
    description=(
        "Return the authenticated voter's "
        "voting history."
    ),
    tags=["Voting"],
)
class VoteHistoryView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        votes = (
            Vote.objects
            .filter(
                voter=request.user
            )
            .select_related(
                "candidate",
                "candidate__position",
                "candidate__position__election",
                "candidate__position__election__organization",
            )
        )

        serializer = VoteHistorySerializer(
            votes,
            many=True,
        )

        return Response(
            serializer.data
        )


@extend_schema(
    summary="Verify Voter Vote",
    description=(
        "Verify the blockchain record belonging "
        "to the authenticated voter."
    ),
    tags=["Voting"],
)
class VoteBlockchainVerificationView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, vote_id):

        try:

            vote = (
                Vote.objects
                .select_related(
                    "candidate",
                    "candidate__position",
                    "candidate__position__election",
                    "candidate__position__election__organization",
                    "block",
                )
                .get(
                    id=vote_id,
                    voter=request.user,
                )
            )

        except Vote.DoesNotExist:

            return Response(
                {
                    "verified": False,
                    "message": (
                        "Vote not found or you do not "
                        "have permission to access it."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        try:

            block = vote.block

        except BlockchainBlock.DoesNotExist:

            return Response(
                {
                    "verified": False,
                    "vote_id": str(vote.id),
                    "message": (
                        "No blockchain record was found "
                        "for this vote."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        # ---------------------------------------------------------
        # Verify the complete blockchain first.
        # This reuses the project's existing validator.
        # ---------------------------------------------------------

        chain_valid = BlockchainValidator.verify()


        # ---------------------------------------------------------
        # Verify this specific vote's Merkle root.
        # ---------------------------------------------------------

        recalculated_merkle = (
            BlockchainService.generate_merkle_root(
                vote
            )
        )

        merkle_valid = (
            recalculated_merkle
            == block.merkle_root
        )


        # ---------------------------------------------------------
        # Recalculate this block's hash.
        # ---------------------------------------------------------

        block_data = (
            f"{block.block_number}"
            f"{block.previous_hash}"
            f"{block.merkle_root}"
            f"{block.vote.id}"
            f"{block.vote.voted_at.isoformat()}"
            f"{block.nonce}"
        )

        recalculated_hash = (
            BlockchainService.generate_hash(
                block_data
            )
        )

        hash_valid = (
            recalculated_hash
            == block.current_hash
        )


        # ---------------------------------------------------------
        # Verify the previous block relationship.
        # ---------------------------------------------------------

        previous_block = (
            BlockchainBlock.objects
            .filter(
                block_number=block.block_number - 1
            )
            .first()
        )


        if block.block_number == 1:

            previous_block_valid = (
                block.previous_hash
                == "0" * 64
            )

        elif previous_block:

            previous_block_valid = (
                block.previous_hash
                == previous_block.current_hash
            )

        else:

            previous_block_valid = False


        verified = (
            chain_valid
            and merkle_valid
            and hash_valid
            and previous_block_valid
        )


        if verified:

            message = (
                "Vote blockchain record verified "
                "successfully."
            )

        else:

            message = (
                "Blockchain verification failed. "
                "The vote record or blockchain integrity "
                "could not be verified."
            )


        return Response(
            {
                "verified": verified,

                "vote_id": str(
                    vote.id
                ),

                "election": (
                    vote.candidate
                    .position
                    .election
                    .title
                ),

                "organization": (
                    vote.candidate
                    .position
                    .election
                    .organization
                    .name
                    if vote.candidate
                    .position
                    .election
                    .organization
                    else None
                ),

                "position": (
                    vote.candidate
                    .position
                    .title
                ),

                "candidate": (
                    f"{vote.candidate.first_name} "
                    f"{vote.candidate.last_name}"
                ),

                "voted_at": vote.voted_at,

                "block_number": (
                    block.block_number
                ),

                "block_hash": (
                    block.current_hash
                ),

                "previous_hash": (
                    block.previous_hash
                ),

                "merkle_root": (
                    block.merkle_root
                ),

                "message": message,
            }
        )