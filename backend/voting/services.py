from django.db import transaction
from django.utils import timezone

from .models import Vote
from candidates.models import Candidate

from audit.models import AuditLog
from audit.services import AuditService
from blockchain.services import BlockchainService

class VotingService:

    @staticmethod
    @transaction.atomic
    def cast_vote(user, candidate_id):

        candidate = Candidate.objects.select_related(
            "position",
            "position__election",
            "position__election__organization",
        ).filter(
            id=candidate_id
        ).first()

        if not candidate:
            raise Exception("Candidate not found.")

        election = candidate.position.election

        if not election.is_active:
            raise Exception("Election not found.")

        if election.status != "ACTIVE":
            raise Exception("Election is not active.")

        now = timezone.now()

        if now < election.start_date:
            raise Exception("Voting has not started yet.")

        if now > election.end_date:
            raise Exception("Election has ended.")

        existing_vote = Vote.objects.filter(
            voter=user,
            candidate__position=candidate.position,
        ).exists()

        if existing_vote:
            raise Exception(
                "You have already voted for this position."
            )

        vote = Vote.objects.create(
            voter=user,
            candidate=candidate,
        )
        # Create a new block in the blockchain
        block = BlockchainService.create_block(vote)

        candidate.total_votes += 1
        candidate.save(update_fields=["total_votes"])


        AuditService.log(
            user=user,
            action=AuditLog.Action.VOTE,
            module="Voting",
            description=(
                f"Vote cast for "
                f"{candidate.first_name} "
                f"{candidate.last_name}"
            ),
            object_id=str(vote.id),
        )

        return vote