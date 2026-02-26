from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from property.models import Listing

from property.serializers import ListingRegisterSerializer, Listingserializer



@api_view(["GET"])
@permission_classes([AllowAny])
def list_listing(request):
    listings = Listing.objects.all()
    serializer = Listingserializer(listings, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_listing(request):    
    serializer = ListingRegisterSerializer(data=request.data, context={"request": request})
    if serializer.is_valid(raise_exception=True):
        serializer.save()

        return Response({"message": "El registro se ha realizado con exito"}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)