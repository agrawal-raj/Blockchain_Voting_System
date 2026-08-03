from django.urls import path

from .views import (
    ElectionListCreateView,
    ElectionDetailView, 
    PublishResultsView,
)

urlpatterns = [

    path(
        "",
        ElectionListCreateView.as_view(),
        name="election_list",
    ),

    path(
        "<uuid:pk>/",
        ElectionDetailView.as_view(),
        name="election_detail",
    ),
    path(
    "<uuid:pk>/publish-results/",
    PublishResultsView.as_view(),
    name="publish_results",
    ),

]