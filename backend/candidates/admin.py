from django.contrib import admin

from .models import Candidate


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):

    list_display = (
        "first_name",
        "last_name",
        "get_position",
        "get_election",
        "designation",
        "total_votes",
    )

    search_fields = (
        "first_name",
        "last_name",
    )

    list_filter = (
        "position",
        "gender",
    )

    def get_position(self, obj):
        return obj.position.title

    get_position.short_description = "Position"

    def get_election(self, obj):
        return obj.position.election.title

    get_election.short_description = "Election"