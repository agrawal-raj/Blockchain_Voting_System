from django.contrib import admin

from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):

    list_display = (
        "created_at",
        "user",
        "action",
        "module",
    )

    search_fields = (
        "module",
        "description",
    )

    list_filter = (
        "action",
        "module",
    )

    readonly_fields = (
        "created_at",
    )