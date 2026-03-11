from django.contrib import admin

from property.models import Listing, Reservation, Favorite

class ListingAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "location_value", "category", "room_count", "bathroom_count", 
                  "guest_count", "price", "user"]

class ReservationAdmin(admin.ModelAdmin):
    list_display = ["listing", "user", "start_date", "end_date", "total_price"]

admin.site.register(Listing, ListingAdmin)
admin.site.register(Reservation, ReservationAdmin)
admin.site.register(Favorite)
