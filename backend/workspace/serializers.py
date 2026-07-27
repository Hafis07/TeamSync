from rest_framework import serializers
from .models import Workspace


class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = "__all__"
        read_only_fields = ["owner"]

class InviteMemberSerializer(serializers.Serializer):
    username = serializers.CharField()