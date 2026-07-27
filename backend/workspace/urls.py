from django.urls import path
from .views import WorkspaceListCreateView, InviteMemberView

urlpatterns = [
    path("", WorkspaceListCreateView.as_view(), name="workspace-list"),
    path("<int:pk>/invite/", InviteMemberView.as_view(), name="workspace-invite"),
]