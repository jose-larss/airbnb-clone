from rest_framework import serializers

from property.models import Listing


from rest_framework import serializers
from property.models import Listing

class ListingSerializer(serializers.ModelSerializer):
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