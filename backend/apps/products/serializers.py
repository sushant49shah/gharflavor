from rest_framework import serializers

from .models import Product
from apps.reviews.serializer import ReviewSerializer

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'category',
            'description',
            'image',
            'price',
            'rating',
            'reviews',
            'stock',
            'badge',
            'created_at',
            'updated_at',
        ]

    def get_category(self, obj):
        return obj.category.name if obj.category else None

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data
