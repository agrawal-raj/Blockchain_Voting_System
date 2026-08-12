from django.core.management.base import BaseCommand
from django.db import transaction

from blockchain.models import BlockchainBlock
from blockchain.services import BlockchainService


class Command(BaseCommand):

    help = "Repair and rebuild the existing blockchain hash chain."

    def handle(self, *args, **options):

        self.stdout.write(
            self.style.WARNING(
                "\nStarting blockchain repair...\n"
            )
        )

        blocks = list(
            BlockchainBlock.objects
            .select_related("vote")
            .order_by("block_number")
        )

        if not blocks:

            self.stdout.write(
                self.style.ERROR(
                    "No blockchain blocks found."
                )
            )

            return

        self.stdout.write(
            f"Found {len(blocks)} blockchain blocks."
        )

        previous_hash = "0" * 64

        try:

            with transaction.atomic():

                for block in blocks:

                    merkle_root = (
                        BlockchainService
                        .generate_merkle_root(
                            block.vote
                        )
                    )

                    block_data = (
                        f"{block.block_number}"
                        f"{previous_hash}"
                        f"{merkle_root}"
                        f"{block.vote.id}"
                        f"{block.vote.voted_at.isoformat()}"
                        f"{block.nonce}"
                    )

                    current_hash = (
                        BlockchainService
                        .generate_hash(
                            block_data
                        )
                    )

                    block.previous_hash = (
                        previous_hash
                    )

                    block.merkle_root = (
                        merkle_root
                    )

                    block.current_hash = (
                        current_hash
                    )

                    block.save(
                        update_fields=[
                            "previous_hash",
                            "merkle_root",
                            "current_hash",
                        ]
                    )

                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Block #{block.block_number} "
                            f"repaired."
                        )
                    )

                    previous_hash = current_hash

            self.stdout.write(
                self.style.SUCCESS(
                    "\nBlockchain repair completed successfully."
                )
            )

        except Exception as error:

            self.stdout.write(
                self.style.ERROR(
                    "\nBlockchain repair failed."
                )
            )

            self.stdout.write(
                self.style.ERROR(
                    str(error)
                )
            )

            raise