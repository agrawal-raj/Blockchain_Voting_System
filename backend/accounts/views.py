from django.utils import timezone

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Registration successful.",
                    "otp": user.otp,   # Demo OTP
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer


class ProfileView(APIView):

    def get(self, request):

        serializer = UserSerializer(request.user)

        return Response(serializer.data)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

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