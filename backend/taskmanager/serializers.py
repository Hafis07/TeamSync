from rest_framework import serializers
from .models import Task, Notification
from .models import Task, Notification, Comment, Activity


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = [
            "created_at",
            "workspace",
        ]

    def create(self, validated_data):
        task = Task.objects.create(**validated_data)

        if task.assigned_to:
            Notification.objects.create(
                user=task.assigned_to,
                message=f"You have been assigned a new task: {task.title}"
            )

        return task
    
class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = [
            "user",
            "task",
            "created_at",
        ]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"


class ActivitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    class Meta:
        model = Activity
        fields = "__all__"

