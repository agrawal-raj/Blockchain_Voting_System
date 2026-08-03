from django.utils import timezone

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.views import TokenObtainPairView
from .services import send_registration_otp
from datetime import timedelta

from .models import User
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(
        summary="Register User",
        description="Register a new user account.",
        tags=["Authentication"],
    )
    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():

                user = serializer.save()

                send_registration_otp(user)

                return Response(
                    {
                        "success": True,
                        "message": "Registration successful. OTP has been sent to your email.",
                    },
                    status=status.HTTP_201_CREATED,
                )

        return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

@extend_schema(
    summary="User Login",
    description="Authenticate a user and return JWT access and refresh tokens.",
    tags=["Authentication"],
)
class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer


class ProfileView(APIView):
    @extend_schema(
        summary="User Profile",
        description="Return the authenticated user's profile.",
        tags=["Authentication"],
    )
    def get(self, request):

        serializer = UserSerializer(request.user)

        return Response(serializer.data)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(
        summary="Verify OTP",
        description="Verify the OTP sent during user registration.",
        tags=["Authentication"],
    )
    def post(self, request):

        email = request.data.get("email")
        otp = request.data.get("otp")

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "User not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if user.otp != otp:

            return Response(
                {
                    "success": False,
                    "message": "Invalid OTP."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if timezone.now() > user.otp_created_at + timedelta(minutes=10):

            return Response(
                {
                    "success": False,
                    "message": "OTP has expired."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_verified = True
        user.otp = ""
        user.otp_created_at = timezone.now()

        user.save()

        return Response(
            {
                "success": True,
                "message": "OTP Verified Successfully."
            }
        )