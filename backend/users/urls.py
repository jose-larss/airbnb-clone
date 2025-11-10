from django.urls import path

from users import views

urlpatterns = [
    path("user/register/", views.register_view),
]
