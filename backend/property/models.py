import uuid

from django.db import models

from users.models import CustomUser




class Listing(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.URLField(max_length=500)  # Mejor que CharField para URLs
    category = models.CharField(max_length=255)
    room_count = models.PositiveIntegerField(default=1)
    bathroom_count = models.PositiveIntegerField(default=1)
    guest_count = models.PositiveIntegerField(default=1)
    location_value = models.CharField(max_length=100)
    price = models.DecimalField(
        decimal_places=2, max_digits=12, default=0.00, help_text="Precio en €"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Relación con User
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="properties"
    )

    class Meta:
        verbose_name = "Listado"
        verbose_name_plural = "Listados"
        ordering = ["-created_at"]  # Mostrar primero los más recientes

    def __str__(self):
        return self.title



class Favorite(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "listing")
        verbose_name = "Favorito"
        verbose_name_plural = "Favoritos"

    def __str__(self):
        return f"{self.user} - {self.listing}"



class Reservation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    total_price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00, help_text="Precio en €")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Relación con User
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="reservation_user")

    # Relación con Listing
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="reservation_listing")

    class Meta:
        verbose_name = "Reserva"
        verbose_name_plural = "Reservas"

    def __str__(self):
        return f"Reservation {self.id}"