from django.contrib import admin

from .models import Vote


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):

    list_display = (
        "voter",
        "candidate",
        "voted_at",
    )

    search_fields = (
        "voter__email",
    )

    list_filter = (

        "candidate",
    )