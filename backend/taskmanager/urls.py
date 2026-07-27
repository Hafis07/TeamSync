from django.urls import path

from .views import (
    TaskListCreateView,
    TaskDetailView,
    NotificationListView,
    NotificationDetailView,
    MarkNotificationReadView,
    CommentListCreateView,
    ActivityListView,
)

from .views import (
    TaskListCreateView,
    TaskDetailView,
    NotificationListView,
    CommentListCreateView,
)

urlpatterns = [

    path(
        "workspace/<int:workspace_id>/",
        TaskListCreateView.as_view(),
        name="task-list-create",
    ),

    path(
        "<int:pk>/",
        TaskDetailView.as_view(),
        name="task-detail",
    ),

    path(
        "notifications/",
        NotificationListView.as_view(),
        name="notification-list",
    ),

    path(
        "notifications/<int:pk>/",
        NotificationDetailView.as_view(),
        name="notification-detail",
    ),

    path(
        "notifications/<int:pk>/read/",
         MarkNotificationReadView.as_view(),
         name="notification-read",
    ),

    path(
        "comments/<int:task_id>/",
         CommentListCreateView.as_view(),
         name="comment-list-create",
    ),

    path(
        "activity/<int:task_id>/",
         ActivityListView.as_view(),
         name="activity-list",
    ),

    path(
        "workspace/<int:workspace_id>/",
         TaskListCreateView.as_view(),
    ),

    path(
         "<int:pk>/",
         TaskDetailView.as_view(),
    ),

]