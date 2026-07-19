from django.urls import path

from .views import (
    OrganizationListCreateView,
    OrganizationDetailView,
)

urlpatterns = [

    path(
        "",
        OrganizationListCreateView.as_view(),
        name="organization_list",
    ),

    path(
        "<uuid:pk>/",
        OrganizationDetailView.as_view(),
        name="organization_detail",
    ),

]