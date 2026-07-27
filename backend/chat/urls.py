from django.urls import path
from .views import MessageListCreateView

urlpatterns = [
    path(
        "workspace/<int:workspace_id>/",
        MessageListCreateView.as_view(),
        name="chat-messages",
    ),
]