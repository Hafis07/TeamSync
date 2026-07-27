import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Message
from workspace.models import Workspace
from accounts.models import User


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()

        print("WebSocket Connected")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        message = data["message"]
        sender_id = data["sender"]

        saved_message = await self.save_message(
            sender_id,
            self.room_name,
            message,
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": saved_message.content,
                "sender": saved_message.sender.id,
                "username": saved_message.sender.username,
                "attachment": (
                    saved_message.attachment.url
                    if saved_message.attachment
                    else None
                ),
                "created_at": saved_message.created_at.strftime(
                    "%d %b %Y %I:%M %p"
                ),
            },
        )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "sender": event["sender"],
                    "username": event["username"],
                    "attachment": event["attachment"],
                    "created_at": event["created_at"],
                }
            )
        )

    @database_sync_to_async
    def save_message(self, sender_id, workspace_id, message):
        sender = User.objects.get(id=sender_id)
        workspace = Workspace.objects.get(id=int(workspace_id))

        return Message.objects.create(
            sender=sender,
            workspace=workspace,
            content=message,
        )