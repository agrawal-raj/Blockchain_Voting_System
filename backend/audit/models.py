from django.conf import settings
from django.db import models

from common.models import BaseModel


class AuditLog(BaseModel):

    class Action(models.TextChoices):
        LOGIN = "LOGIN", "Login"
        LOGOUT = "LOGOUT", "Logout"

        CREATE = "CREATE", "Create"
        UPDATE = "UPDATE", "Update"
        DELETE = "DELETE", "Delete"

        VOTE = "VOTE", "Vote"

        RESULT = "RESULT", "Publish Result"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    action = models.CharField(
        max_length=30,
        choices=Action.choices,
    )

    module = models.CharField(
        max_length=50,
    )

    object_id = models.CharField(
        max_length=100,
        blank=True,
    )

    description = models.TextField()

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
    )

    user_agent = models.TextField(
        blank=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} - {self.action}"