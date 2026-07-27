from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from workspace.models import Workspace

from .models import Task, Notification, Comment, Activity
from .serializers import (
    TaskSerializer,
    NotificationSerializer,
    CommentSerializer,
    ActivitySerializer,
)


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        workspace_id = self.kwargs["workspace_id"]

        queryset = Task.objects.filter(workspace_id=workspace_id)

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(title__icontains=search)

        status_filter = self.request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        priority = self.request.query_params.get("priority")
        if priority:
            queryset = queryset.filter(priority=priority)

        assigned_to = self.request.query_params.get("assigned_to")
        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)

        ordering = self.request.query_params.get("ordering")
        if ordering == "due_date":
            queryset = queryset.order_by("due_date")
        elif ordering == "-due_date":
            queryset = queryset.order_by("-due_date")

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print("SERIALIZER ERRORS:", serializer.errors)
            return Response(serializer.errors, status=400)

        workspace = Workspace.objects.get(
            id=self.kwargs["workspace_id"]
        )

        task = serializer.save(workspace=workspace)

        Activity.objects.create(
            task=task,
            user=request.user,
            action="Task created"
        )

        if task.assigned_to:
            Notification.objects.create(
                user=task.assigned_to,
                message=f"You have been assigned task: {task.title}"
            )

            Activity.objects.create(
                task=task,
                user=request.user,
                action=f"Assigned task to {task.assigned_to.username}"
            )

        return Response(TaskSerializer(task).data, status=201)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        old_task = self.get_object()

        old_status = old_task.status
        old_priority = old_task.priority
        old_assigned = old_task.assigned_to

        task = serializer.save()

        if old_status != task.status:
            Activity.objects.create(
                task=task,
                user=self.request.user,
                action=f"Status changed to {task.status}"
            )

        if old_priority != task.priority:
            Activity.objects.create(
                task=task,
                user=self.request.user,
                action=f"Priority changed to {task.priority}"
            )

        if old_assigned != task.assigned_to and task.assigned_to:
            Activity.objects.create(
                task=task,
                user=self.request.user,
                action=f"Assigned to {task.assigned_to.username}"
            )

            Notification.objects.create(
                user=task.assigned_to,
                message=f"You have been assigned task: {task.title}"
            )

    def perform_destroy(self, instance):
        Activity.objects.create(
            task=instance,
            user=self.request.user,
            action="Task deleted"
        )
        instance.delete()


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        ).order_by("-created_at")


class NotificationDetailView(generics.RetrieveUpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]


class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            notification = Notification.objects.get(
                pk=pk,
                user=request.user
            )
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        notification.is_read = True
        notification.save()

        return Response(
            {"message": "Notification marked as read"}
        )


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(
            task_id=self.kwargs["task_id"]
        ).order_by("created_at")

    def perform_create(self, serializer):
        task = Task.objects.get(id=self.kwargs["task_id"])

        serializer.save(
            user=self.request.user,
            task=task
        )

        Activity.objects.create(
            task=task,
            user=self.request.user,
            action="Comment added"
        )


class ActivityListView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(
            task_id=self.kwargs["task_id"]
        )