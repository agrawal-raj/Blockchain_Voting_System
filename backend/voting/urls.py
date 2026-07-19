from django.urls import path

from .views import CastVoteView

urlpatterns = [

    path(
        "cast/",
        CastVoteView.as_view(),
        name="cast_vote",
    ),

]