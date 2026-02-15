from djoser.serializers import UserCreateSerializer
from .models import CustomUser

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = CustomUser
        fields = ('id', 'email', 'username', 'password')


"""
OPCIÓN B (NO recomendada, pero válida)

👉 Mantener AbstractUser, pero decirle explícitamente a Djoser
que NO pida username.

"""