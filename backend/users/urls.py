from django.urls import path, re_path, include

#from users.views import token_login_cookie

urlpatterns = [
    #path("auth/token/login/", token_login_cookie),
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),
]
