from django.urls import path

from users import views

urlpatterns = [
    path("user/register/", views.register_view),
    path("user/login/", views.my_token_obtain_pair_view),
    path('user/me/', views.current_user, name='current_user'),
]
