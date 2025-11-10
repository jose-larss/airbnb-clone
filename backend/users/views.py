from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken

from users.serializers import RegisterSerializer, MyTokenObtainPairSerializer, UserSerializer



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Devuelve los datos del usuario autenticado.
    El token JWT debe enviarse en el header Authorization: Bearer <access_token>
    """
    user = request.user
    serializer = UserSerializer(user)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def my_token_obtain_pair_view(request):
    serializer = MyTokenObtainPairSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.user
        refresh = RefreshToken.for_user(user)
       
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        
        return Response(
            {
                "message": "Usuario registrado correctamente",
                "user": {
                    "email": user.email,
                    "username": user.username
                }
            },status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
