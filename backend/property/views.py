from django.shortcuts import render

from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from property.models import Listing, Favorite

from property.serializers import ListingRegisterSerializer, Listingserializer



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_favorite(request):
    listing_id = request.data.get("listing_id")
    listing = get_object_or_404(Listing, id=listing_id)
    """
    es lo mismo que get_objedct_or_404
    try:
        listing = Listing.objects.get(id=listing_id)
    except Listing.DoesNotExist:
        return Response({"detail": "Listing not found"},status=status.HTTP_404_NOT_FOUND)
    """
    Favorite.objects.get_or_create(user=request.user, listing=listing)

    return Response({"favorited": True}, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_favorite(request, listing_id):
    Favorite.objects.filter(user=request.user, listing_id=listing_id).delete()

    return Response({"favorited": False}, status=status.HTTP_200_OK)



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