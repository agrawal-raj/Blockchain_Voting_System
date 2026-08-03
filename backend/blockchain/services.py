import hashlib

from django.db import transaction

from audit.models import AuditLog
from audit.services import AuditService

from .models import BlockchainBlock


class BlockchainService:

    @staticmethod
    def generate_hash(data):

        return hashlib.sha256(
            data.encode()
        ).hexdigest()

    @staticmethod
    def generate_merkle_root(vote):

        candidate = vote.candidate
        position = candidate.position
        election = position.election
        organization = election.organization

        data = (
            f"{vote.id}"
            f"{vote.voter_id}"
            f"{candidate.id}"
            f"{position.id}"
            f"{election.id}"
            f"{organization.id}"
            f"{vote.voted_at.isoformat()}"
        )

        return BlockchainService.generate_hash(data)

    @staticmethod
    @transaction.atomic
    def create_block(vote, user=None, request=None):

        previous_block = (
            BlockchainBlock.objects
            .order_by("-block_number")
            .first()
        )

        if previous_block:

            block_number = previous_block.block_number + 1

            previous_hash = previous_block.current_hash

        else:

            block_number = 1

            previous_hash = "0" * 64

        merkle_root = BlockchainService.generate_merkle_root(
            vote
        )

        nonce = 0

        block_data = (
            f"{block_number}"
            f"{previous_hash}"
            f"{merkle_root}"
            f"{vote.id}"
            f"{vote.voted_at.isoformat()}"
            f"{nonce}"
        )

        current_hash = BlockchainService.generate_hash(
            block_data
        )

        block = BlockchainBlock.objects.create(
            block_number=block_number,
            vote=vote,
            previous_hash=previous_hash,
            current_hash=current_hash,
            nonce=nonce,
            merkle_root=merkle_root,
        )

        AuditService.log(
            user=user,
            action=AuditLog.Action.BLOCK_CREATED,
            module="Blockchain",
            description=(
                f"Blockchain block #{block.block_number} "
                f"created successfully."
            ),
            request=request,
            object_id=str(block.id),
        )

        return block