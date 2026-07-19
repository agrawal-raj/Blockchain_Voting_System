from django.urls import path

from .views import (
    PositionListCreateView,
    PositionDetailView,
)

urlpatterns = [

    path(
        "",
        PositionListCreateView.as_view(),
        name="position_list",
    ),

    path(
        "<uuid:pk>/",
        PositionDetailView.as_view(),
        name="position_detail",
    ),

]