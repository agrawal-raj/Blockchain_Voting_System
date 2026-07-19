from django.contrib import admin

from .models import BlockchainBlock


@admin.register(BlockchainBlock)
class BlockchainBlockAdmin(admin.ModelAdmin):

    list_display = (
        "block_number",
        "vote",
        "current_hash",
        "created_at",
    )

    readonly_fields = (
        "previous_hash",
        "current_hash",
        "merkle_root",
    )

    search_fields = (
        "current_hash",
    )