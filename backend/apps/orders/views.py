from decimal import Decimal

from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from apps.products.models import Product
from .models import Order, OrderItem, Address
from .serializers import CheckoutSerializer, OrderSerializer, ShippingAddressSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def adminOrders(request):
    if request.method == 'GET':
        orders = Order.objects.select_related('user', 'shipping_address').prefetch_related('items')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    order_id = request.data.get('order_id')
    new_status = request.data.get('status')

    if not order_id or not new_status:
        return Response(
            {'detail': 'order_id and status are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    valid_statuses = [choice.value for choice in Order.Status]
    if new_status not in valid_statuses:
        return Response(
            {'detail': 'Invalid order status.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    order = get_object_or_404(Order, pk=order_id)

    if order.status == new_status:
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    try:
        order.transition_to(new_status)
    except ValueError as exc:
        return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    serializer = OrderSerializer(order)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    orders = Order.objects.filter(user=request.user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderDetail(request, pk):
    order = get_object_or_404(Order, pk=pk, user=request.user)
    serializer = OrderSerializer(order)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createAddress(request):
    data = request.data
    
    address = Address.objects.filter(
        user=request.user,
        label=data.get('label', 'Home'),
        full_name=data['full_name'],
        phone=data['phone'],
        street=data['street'],
        city=data['city'],
        state=data['state'],
        postal_code=data['postal_code'],
        country=data['country'],
    ).first()
    
    if not address:
        serializer = ShippingAddressSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        address = serializer.save(user=request.user)
    
    return Response(
        ShippingAddressSerializer(address).data,
        status=status.HTTP_201_CREATED
    )
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createOrder(request):
    serializer = CheckoutSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    payload = serializer.validated_data

    shipping_data = payload['shipping_address']
    payment_method = payload['payment_method']
    items = payload['items']
    discount = payload.get('discount', Decimal('0.00'))

    subtotal = sum(
        item['unit_price'] * item['quantity']
        for item in items
    )
    shipping_cost = Decimal('0.00') if subtotal > Decimal('50.00') else Decimal('5.00')
    total = subtotal + shipping_cost - discount
    
    address, _ = Address.objects.get_or_create(
        user=request.user,
        label=shipping_data.get('label', 'Home'),
        full_name=shipping_data['full_name'],
        phone=shipping_data['phone'],
        street=shipping_data['street'],
        city=shipping_data['city'],
        state=shipping_data['state'],
        postal_code=shipping_data['postal_code'],
        country=shipping_data['country'],
        defaults={
        'label': shipping_data.get('label', 'Home'),
        'full_name': shipping_data['full_name'],
        'phone': shipping_data['phone'],
    }
    )

    order = Order.objects.create(
        user=request.user,
        shipping_address=address,
        payment_method=payment_method,
        payment_status=(
            Order.PaymentStatus.COMPLETED
            if payment_method == Order.PaymentMethod.CARD
            else Order.PaymentStatus.PENDING
        ),
        subtotal=subtotal,
        discount=discount,
        shipping_cost=shipping_cost,
        total=total,
    )

    for item in items:
        product = get_object_or_404(Product, pk=item['product_id'])
        OrderItem.objects.create(
            order=order,
            variant=product,
            product_name=item.get('product_name', product.name),
            variant_name=item.get('variant_name', str(product)),
            unit_price=item['unit_price'],
            quantity=item['quantity'],
        )

    response_serializer = OrderSerializer(order)
    return Response(response_serializer.data, status=status.HTTP_201_CREATED)
