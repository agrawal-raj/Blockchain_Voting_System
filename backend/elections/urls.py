from django.urls import path

from .views import (
    ElectionListCreateView,
    ElectionDetailView,
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

]