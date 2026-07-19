from .models import BlockchainBlock
from .services import BlockchainService


class BlockchainValidator:

    @staticmethod
    def verify():

        previous_hash = "0" * 64

        blocks = BlockchainBlock.objects.select_related(
            "vote",
            "vote__candidate",
            "vote__candidate__position",
            "vote__candidate__position__election",
            "vote__candidate__position__election__organization",
        ).order_by("block_number")

        for block in blocks:

            recalculated_merkle = (
                BlockchainService.generate_merkle_root(
                    block.vote
                )
            )

            if recalculated_merkle != block.merkle_root:
                return False

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

            if recalculated_hash != block.current_hash:
                return False

            if previous_hash != block.previous_hash:
                return False

            previous_hash = block.current_hash

        return True