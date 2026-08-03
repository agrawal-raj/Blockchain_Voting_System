from django.shortcuts import render

# Create your views here.
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import PositionResultSerializer
from .services import ResultService
from drf_spectacular.utils import extend_schema


@extend_schema(
    summary="Get Position Result",
    description="Retrieve the result for a specific position.",
    tags=["Results"],
)
class PositionResultView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, position_id):

        result = ResultService.position_result(
            position_id,
            user=request.user
        )

        serializer = PositionResultSerializer(
            instance=result
    )

        return Response(serializer.data)


@extend_schema(
    summary="Get Election Result",
    description="Retrieve the result for a specific election.",
    tags=["Results"],
)
class ElectionResultView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, election_id):

        return Response(

            ResultService.election_result(
                election_id, user=request.user
            )

        )


@extend_schema(
    summary="Get Organization Result",
    description="Retrieve the result for a specific organization.",
    tags=["Results"],
)
class OrganizationResultView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, organization_id):

        return Response(

            ResultService.organization_result(
                organization_id, user=request.user
            )

        )


@extend_schema(
    summary="Get Dashboard Result",
    description="Retrieve the dashboard result.",
    tags=["Results"],
)
class DashboardView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        return Response(

            ResultService.dashboard()

        )