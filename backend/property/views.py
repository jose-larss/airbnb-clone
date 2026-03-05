from django.shortcuts import render

from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from users.models import CustomUser
from property.models import Listing, Favorite, Reservation

from property.serializers import ListingRegisterSerializer, Listingserializer, ReservationRegisterSerializer, ReservationSerializer



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
def detail_listing(request, listing_id):
    listing = get_object_or_404(Listing, id=listing_id)
    serializer = Listingserializer(listing)

    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_reservations(request, listing_id=None, author_id=None, user_id=None):
    if listing_id:
        reservas = Reservation.objects.filter(listing__id=listing_id).order_by("-created_at")

    elif user_id:
        reservas = Reservation.objects.filter(user__id=user_id).order_by("start_date")

    else:
        return Response(
            {"error": "Debe proporcionar listing_id o user_id"},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = ReservationSerializer(reservas, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def list_listing(request):
    listings = Listing.objects.all()
    serializer = Listingserializer(listings, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_reservation(request):
    serializer = ReservationRegisterSerializer(data=request.data, context={"request": request})
    if serializer.is_valid(): #raise_exception=True
        serializer.save()

        return Response({"message": "La reserva se ha realizado con exito"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
"""
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_reservation(request):
    startDate = request.data.get("startDate")
    endDate = request.data.get("endDate")
    totalPrice = request.data.get("totalPrice")
    listingId = request.data.get("listingId")

    print(startDate, endDate, totalPrice, listingId)

    listing = get_object_or_404(Listing, id=listingId)
    user = request.user

    Reservation.objects.create(
        total_price=totalPrice,
        start_date=startDate,
        end_date=endDate, 
        listing=listing,
        user=user,
    )
    return Response({"message": "La reserva se ha realizado correctamente"}, status=status.HTTP_201_CREATED)
"""


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_listing(request):    
    serializer = ListingRegisterSerializer(data=request.data, context={"request": request})
    if serializer.is_valid(): #raise_exception=True
        serializer.save()

        return Response({"message": "El registro se ha realizado con exito"}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)