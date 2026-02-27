from rest_framework import serializers
from djoser.serializers import UserCreateSerializer
from .models import CustomUser
from property.models import Favorite



class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = CustomUser
        fields = ('id', 'email', 'username', 'password')


class CustomUserSerializer(serializers.ModelSerializer):
    favorite_ids = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'favorite_ids')

    def get_favorite_ids(self, user):
        return list(Favorite.objects.filter(user=user).values_list("listing_id", flat=True)
                    )
"""
OPCIÓN B (NO recomendada, pero válida)

👉 Mantener AbstractUser, pero decirle explícitamente a Djoser
que NO pida username.

"""