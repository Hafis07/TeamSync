from django.db import models

from accounts.models import User
from workspace.models import Workspace


class Message(models.Model):

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    content = models.TextField(blank=True)

    attachment = models.FileField(
        upload_to="chat_files/",
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        if self.content:
            return f"{self.sender.username}: {self.content[:30]}"
        return f"{self.sender.username} uploaded a file"