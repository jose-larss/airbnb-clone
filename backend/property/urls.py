from django.urls import path


from property.views import register_listing, list_listing, add_favorite, remove_favorite, detail_listing, register_reservation, list_reservations

urlpatterns = [
    path("property/listing/<uuid:listing_id>/", detail_listing),
    path("property/register/", register_listing),
    path("property/listings/", list_listing),
    path("favorites/<uuid:listing_id>/remove/", remove_favorite),
    path("favorites/", add_favorite),
    path("reservation/register/", register_reservation),
    path("reservations/<uuid:listing_id>/", list_reservations),
]