from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="sender.username",
        read_only=True,
    )

    class Meta:
        model = Message
        fields = [
            "id",
            "sender",
            "username",
            "content",
            "attachment",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "sender",
            "username",
            "created_at",
        ]