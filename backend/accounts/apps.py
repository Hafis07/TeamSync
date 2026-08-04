from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        try:
            from django.contrib.auth import get_user_model

            User = get_user_model()

            user, created = User.objects.get_or_create(
                username="hafis",
                defaults={
                    "email": "hafisshamsu@gmail.com",
                    "is_active": True,
                },
            )

            user.set_password("Hafis@123")
            user.is_active = True
            user.save()

            print("✓ Default user password reset")
        except Exception:
            pass