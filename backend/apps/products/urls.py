from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_products, name="products-list"),
    path("categories/", views.get_categories, name="products-categories"),
    path("<str:pk>/", views.get_product, name="product-detail"),
]
