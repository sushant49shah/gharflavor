from rest_framework import serializers
from .models import Order, OrderItem, Address


class ShippingAddressInputSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=20)
    street = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100)
    label = serializers.CharField(max_length=50, default='Home', required=False)


class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField(max_length=255)
    variant_name = serializers.CharField(max_length=100, required=False, default='Standard')
    quantity = serializers.IntegerField(min_value=1)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2)


class CheckoutSerializer(serializers.Serializer):
    shipping_address = ShippingAddressInputSerializer()
    payment_method = serializers.ChoiceField(choices=[choice.value for choice in Order.PaymentMethod])
    items = OrderItemCreateSerializer(many=True, min_length=1)
    discount = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('At least one cart item is required.')
        return value


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id',
            'label',
            'full_name',
            'phone',
            'street',
            'city',
            'state',
            'postal_code',
            'country',
        ]
        read_only_fields = fields


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product_name',
            'variant_name',
            'unit_price',
            'quantity',
            'line_total',
        ]
        read_only_fields = fields


class OrderSerializer(serializers.ModelSerializer):
    shipping_address = ShippingAddressSerializer()
    items = OrderItemSerializer(many=True)
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'customer_name',
            'customer_email',
            'status',
            'payment_method',
            'payment_status',
            'subtotal',
            'discount',
            'shipping_cost',
            'total',
            'created_at',
            'updated_at',
            'shipping_address',
            'items',
        ]
        read_only_fields = fields

    def get_customer_name(self, obj):
        return obj.user.first_name or obj.user.username

    def get_customer_email(self, obj):
        return obj.user.email
