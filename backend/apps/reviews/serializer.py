from .models import Review
from rest_framework import serializers

class ReviewSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id',
            'product',
            'product_name',
            'user',
            'customer_name',
            'customer_email',
            'rating',
            'comment',
            'created_at',
        ]

    def get_product_name(self, obj):
        return obj.product.name if obj.product else ''

    def get_customer_name(self, obj):
        if not obj.user:
            return ''
        return obj.user.first_name or obj.user.username

    def get_customer_email(self, obj):
        return obj.user.email if obj.user else ''
    
    
