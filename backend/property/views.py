from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from property.models import Listing

from property.serializers import ListingSerializer



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_listing(request):
    listing = request.data
    print("listing es", listing)
    
    serializer = ListingSerializer(data=request.data, context={"request": request})
    if serializer.is_valid(raise_exception=True):
        serializer.save()

        return Response({"message": "El registro se ha realizado con exito"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)