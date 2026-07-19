from django.contrib import admin

from .models import Election


@admin.register(Election)
class ElectionAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "election_type",
        "status",
        "start_date",
        "end_date",
    )

    search_fields = (
        "title",
    )

    list_filter = (
        "status",
        "election_type",
    )