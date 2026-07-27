from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Workspace
from .serializers import WorkspaceSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from accounts.models import User
from .serializers import InviteMemberSerializer


class WorkspaceListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Workspace.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class InviteMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        workspace = get_object_or_404(Workspace, pk=pk)

        if workspace.owner != request.user:
            return Response(
                {"error": "Only the owner can invite members."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = InviteMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        workspace.members.add(user)

        return Response(
            {"message": "Member added successfully."},
            status=status.HTTP_200_OK
        )