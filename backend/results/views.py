from django.shortcuts import render

# Create your views here.
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import PositionResultSerializer
from .services import ResultService


class PositionResultView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, position_id):

        result = ResultService.position_result(
            position_id
        )

        serializer = PositionResultSerializer(
            instance=result
    )

        return Response(serializer.data)


class ElectionResultView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, election_id):

        return Response(

            ResultService.election_result(
                election_id
            )

        )


class OrganizationResultView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, organization_id):

        return Response(

            ResultService.organization_result(
                organization_id
            )

        )


class DashboardView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        return Response(

            ResultService.dashboard()

        )