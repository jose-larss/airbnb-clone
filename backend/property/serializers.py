from rest_framework import serializers
from rest_framework.generics import get_object_or_404

from property.models import Listing


from rest_framework import serializers
from property.models import Listing, Reservation

from users.serializers import CustomUserSerializer




class ReservationRegisterSerializer(serializers.ModelSerializer):
    # camelCase mapping
    startDate = serializers.DateTimeField(source="start_date")
    endDate = serializers.DateTimeField(source="end_date")
    totalPrice = serializers.IntegerField(source="total_price")
    listingId = serializers.UUIDField(write_only=True)

    class Meta:
        model = Reservation
        fields = ("listingId", "startDate", "endDate", "totalPrice", "user")
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def create(self, validated_data):
        """
        👉 Hace DOS cosas a la vez:
        Devuelve el valor de la clave
        Elimina esa clave del diccionario
        """
        listing_id = validated_data.pop("listingId")
        user = self.context["request"].user

        listing = get_object_or_404(Listing, id=listing_id)

        return Reservation.objects.create(listing=listing, user=user, **validated_data)




class Listingserializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Listing
        fields = ["id", "title", "description", "image", "category", "room_count", "bathroom_count", 
                  "guest_count", "location_value", "price", "user", "created_at", "updated_at"]


class ReservationSerializer(serializers.ModelSerializer):
    listing = Listingserializer(many=False, read_only=True)
    
    class Meta:
        model = Reservation
        fields = ["id", "total_price", "start_date", "end_date", "user", "listing", "created_at", "updated_at"]


class ListingRegisterSerializer(serializers.ModelSerializer):
    # camelCase mapping
    guestCount = serializers.IntegerField(source="guest_count")
    roomCount = serializers.IntegerField(source="room_count")
    bathroomCount = serializers.IntegerField(source="bathroom_count")
    imagesrc = serializers.CharField(source="image")
    
    # location JSON from frontend → label only
    location = serializers.JSONField(write_only=True, required=True)
    
    # user solo lectura, se asigna automáticamente
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Listing
        fields = [
            "id", "title", "description", "imagesrc", "category",
            "roomCount", "bathroomCount", "guestCount", "location",
            "price", "user", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def validate(self, attrs):
        location_data = attrs.pop("location", None)
        if not location_data or "label" not in location_data:
            raise serializers.ValidationError({"location": "Label de location es requerido"})
        # Guardamos solo la label para el modelo
        attrs["location_value"] = location_data["label"]
        return attrs

    def create(self, validated_data):
        # Asignar usuario automáticamente desde request
        user = self.context["request"].user
        validated_data["user"] = user
        return Listing.objects.create(**validated_data)