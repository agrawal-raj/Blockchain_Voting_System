from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response

from .permissions import IsAdminOnly
from .serializers import DashboardSerializer
from .services import DashboardService


class DashboardView(APIView):

    permission_classes = [
        IsAdminOnly
    ]

    def get(self, request):

        data = DashboardService.dashboard()

        serializer = DashboardSerializer(
            instance=data
        )

        return Response(serializer.data)