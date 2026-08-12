from django.urls import path

from .views import PositionResultView, ElectionResultView, OrganizationResultView, DashboardView, PublishedResultsView

urlpatterns = [

    path(
        "position/<uuid:position_id>/",
        PositionResultView.as_view(),
        name="position_result",
    ),
    path(
    "election/<uuid:election_id>/",
    ElectionResultView.as_view(),
),

path(
    "organization/<uuid:organization_id>/",
    OrganizationResultView.as_view(),
),

path(
    "dashboard/",
    DashboardView.as_view(),
),
path(
    "published/",
    PublishedResultsView.as_view(),
    name="published_results",
),

]