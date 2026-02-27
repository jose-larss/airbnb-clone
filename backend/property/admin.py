from django.contrib import admin

from property.models import Listing, Reservation, Favorite

admin.site.register(Listing)
admin.site.register(Reservation)
admin.site.register(Favorite)
