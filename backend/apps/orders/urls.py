from django.urls import path
from . import views

urlpatterns = [
    path('admin/', views.adminOrders, name='admin-orders'),
    path('', views.getMyOrders, name='orders-list'),
    path('create/', views.createOrder, name='orders-create'),
    path('<str:pk>/', views.getOrderDetail, name='order-detail'),
]
