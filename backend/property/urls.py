from django.urls import path


from property.views import register_listing, list_listing

urlpatterns = [
    path("property/register/", register_listing),
    path("property/listings/", list_listing),
]