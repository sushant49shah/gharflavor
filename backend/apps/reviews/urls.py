from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_reviews, name="reviews-list"),
    path("product/<str:pk>/", views.create_review, name="create-review"),
]
