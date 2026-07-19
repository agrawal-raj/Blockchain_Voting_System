from django.contrib import admin

from .models import Position


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "election",
        "result_type",
        "max_votes_per_voter",
        "display_order",
    )

    search_fields = (
        "title",
    )

    list_filter = (
        "election",
        "result_type",
    )