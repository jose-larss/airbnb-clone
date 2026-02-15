from djoser.views import TokenCreateView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

"""
@api_view(["POST"])
@permission_classes([AllowAny])
def token_login_cookie(request):
    # Reutilizamos la lógica interna de Djoser
    view = TokenCreateView.as_view()
    response = view(request._request)

    # Si hubo error (credenciales inválidas, etc.)
    if response.status_code != 200:
        return response

    token = response.data.get("auth_token")

    response.set_cookie(
        key="auth_token",
        value=token,
        httponly=True,
        secure=True,      # ⚠️ ponlo en False solo en desarrollo
        samesite="Lax",
    )

    response.data = {"detail": "Login ok"}
    return response


from djoser.views import TokenCreateView
from rest_framework.response import Response

class TokenCreateCookieView(TokenCreateView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = response.data.get("auth_token")

        response.set_cookie(
            "auth_token",
            token,
            httponly=True,
            secure=True,
            samesite="Lax",
        )

        response.data = {"detail": "Login ok"}
        return response
"""