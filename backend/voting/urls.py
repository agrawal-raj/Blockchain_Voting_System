from django.urls import path


from .views import (
    CastVoteView,
    AvailableElectionListView,
    ElectionDetailView,
    PositionCandidateListView,
    VoteHistoryView,
    VoteBlockchainVerificationView,
)

urlpatterns = [

    path(
        "cast/",
        CastVoteView.as_view(),
        name="cast_vote",
    ),
    path(
        "elections/",
        AvailableElectionListView.as_view(),
        name="available_elections",
    ),

    path(
        "elections/<uuid:pk>/",
        ElectionDetailView.as_view(),
        name="election_detail",
    ),

    path(
        "positions/<uuid:pk>/candidates/",
        PositionCandidateListView.as_view(),
        name="position_candidates",
    ),
    path(
        "history/",
        VoteHistoryView.as_view(),
        name="vote_history",
    ),
    path(
        "history/<uuid:vote_id>/verify/",
        VoteBlockchainVerificationView.as_view(),
        name="verify_vote_blockchain",
    ),


]