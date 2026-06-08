from django.urls import path

from . import views


urlpatterns = [
    path("", views.users, name="users"),
    path("login/", views.login_user, name="users-login"),
    path("register/", views.register_user, name="users-register"),
    path("profile/", views.get_user_profile, name="users-profile"),
    path("profile/update/", views.update_user_profile, name="users-profile-update"),
    path("<str:pk>/", views.user_detail, name="users-detail"),
]
