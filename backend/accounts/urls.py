from django.urls import path

from .views import (
    LoginView,
    ProfileView,
    RegisterView,
    VerifyOTPView,
)

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [

    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "verify-otp/",
        VerifyOTPView.as_view(),
        name="verify_otp",
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="refresh",
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),
]