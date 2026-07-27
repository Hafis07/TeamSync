from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from taskmanager.models import Task, Notification


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        total_tasks = Task.objects.count()

        completed_tasks = Task.objects.filter(
            status="done"
        ).count()

        pending_tasks = Task.objects.filter(
            status="todo"
        ).count()

        in_progress_tasks = Task.objects.filter(
            status="progress"
        ).count()

        my_tasks = Task.objects.filter(
            assigned_to=user
        ).count()

        unread_notifications = Notification.objects.filter(
            user=user,
            is_read=False
        ).count()

        return Response({
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "in_progress_tasks": in_progress_tasks,
            "my_tasks": my_tasks,
            "unread_notifications": unread_notifications,
        })

# Create your views here.
