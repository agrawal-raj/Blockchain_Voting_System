from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User
from .services import generate_otp


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "student_id",
            "mobile_number",
            "password",
        )

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data,
        )

        user.otp = generate_otp()
        user.otp_created_at = timezone.now()
        user.save()

        return user


class LoginSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = (
            "password",
            "groups",
            "user_permissions",
            "otp",
        )