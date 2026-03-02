from django.contrib import admin

from property.models import Listing, Reservation, Favorite

class ListingAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "category", "room_count", "bathroom_count", 
                  "guest_count", "location_value", "price", "user"]

admin.site.register(Listing, ListingAdmin)
admin.site.register(Reservation)
admin.site.register(Favorite)
