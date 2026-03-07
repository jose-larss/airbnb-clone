from django.urls import path


from property.views import (register_listing, 
                            list_listing, 
                            add_favorite, 
                            remove_favorite, 
                            detail_listing, 
                            register_reservation, 
                            list_reservations,
                            remove_reservation,
                            list_favorites)

urlpatterns = [
    path("property/listing/<uuid:listing_id>/", detail_listing),
    path("property/register/", register_listing),
    path("property/listings/", list_listing),

    path("favorites/<uuid:listing_id>/remove/", remove_favorite),
    path("favorites/add/", add_favorite),
    path("favorites/listings/", list_favorites),
    
    path("reservation/register/", register_reservation),
    #path("reservations/<uuid:listing_id>/", list_reservations),
    #path("reservations/<uuid:user_id>/", list_reservations),
    path("reservations/listing/<uuid:listing_id>/", list_reservations),
    path("reservations/user/<uuid:user_id>/", list_reservations),
    path("reservations/author/<uuid:author_id>/", list_reservations),
    path("reservation/<uuid:reservation_id>/remove/", remove_reservation),
]