from .models import AuditLog


class AuditService:

    @staticmethod
    def log(
        user,
        action,
        module,
        description,
        request=None,
        object_id="",
    ):

        ip = None
        user_agent = ""

        if request:

            ip = request.META.get(
                "REMOTE_ADDR"
            )

            user_agent = request.META.get(
                "HTTP_USER_AGENT",
                "",
            )

        AuditLog.objects.create(

            user=user,

            action=action,

            module=module,

            object_id=object_id,

            description=description,

            ip_address=ip,

            user_agent=user_agent,

        )