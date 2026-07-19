from django.contrib import admin

from .models import Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "organization_type",
        "email",
        "phone",
        "is_active",
    )

    search_fields = (
        "name",
        "email",
    )

    list_filter = (
        "organization_type",
        "is_active",
    )