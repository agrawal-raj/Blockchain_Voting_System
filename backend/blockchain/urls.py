from django.urls import path

from .views import (
    BlockchainListView,
    BlockchainDetailView,
    BlockchainVerifyView,
)

urlpatterns = [

    path(
        "",
        BlockchainListView.as_view(),
        name="blockchain_list",
    ),

    path(
        "<int:block_number>/",
        BlockchainDetailView.as_view(),
        name="block_detail",
    ),
    path(
        "verify/",
        BlockchainVerifyView.as_view(),
        name="verify_blockchain",
    ),

]