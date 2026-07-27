from django.db import models
from accounts.models import User

class Workspace(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="owned_workspaces"
    )

    members = models.ManyToManyField(
        User,
        related_name="workspaces",
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name