from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Message
from .serializers import MessageSerializer


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = (
        MultiPartParser,
        FormParser,
    )

    def get_queryset(self):
        workspace_id = self.kwargs["workspace_id"]

        return Message.objects.filter(
            workspace_id=workspace_id
        )

    def perform_create(self, serializer):
        workspace_id = self.kwargs["workspace_id"]

        message = serializer.save(
            sender=self.request.user,
            workspace_id=workspace_id,
        )

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"chat_{workspace_id}",
            {
                "type": "chat_message",
                "message": message.content,
                "sender": message.sender.id,
                "username": message.sender.username,
                "attachment": (
                    message.attachment.url
                    if message.attachment
                    else None
                ),
                "created_at": message.created_at.strftime(
                    "%d %b %Y %I:%M %p"
                ),
            },
        )