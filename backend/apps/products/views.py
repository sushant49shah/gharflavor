from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.common.pagination import ProductPagination

from .models import Category, Product
from .serializers import ProductSerializer

# Create your views here.
@api_view(["GET", "POST"])
def get_products(request):
    if request.method == "GET":
        # products = Product.objects.all()
        products = Product.objects.all().order_by('-created_at')
        serializer = ProductSerializer(products, many=True)
        
        # filtering by category
        category = request.query_params.get('category')
        if category:
            products = products.filter(category__name=category)
            
        # filtering by search
        search = request.query_params.get('search')
        if search:
            products = products.filter(name__icontains=search)
            
        # pagination
        paginator = ProductPagination()
        paginated_products = paginator.paginate_queryset(products, request)
        serializer = ProductSerializer(paginated_products, many=True)
        return paginator.get_paginated_response(serializer.data)  # changed
    
        # return Response(serializer.data)

    if request.method == "POST":
        if not request.user.is_staff:
            return Response(
                {'detail': 'Admin privilege required to create products.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        data = request.data
        category_name = data.get('category')
        category = Category.objects.filter(name=category_name).first() if category_name else None

        product = Product.objects.create(
            user=request.user if request.user.is_authenticated else None,
            name=data.get('name', '').strip(),
            category=category,
            description=data.get('description', '').strip(),
            image=data.get('image', '').strip(),
            price=data.get('price') or 0,
            rating=data.get('rating') or 0,
            reviews=data.get('reviews') or 0,
            stock=data.get('stock') or 0,
            badge=data.get('badge', 'none'),
        )
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def get_categories(request):
    categories = Category.objects.all().order_by('name')
    data = [
        {
            'name': category.name,
            'label': category.get_name_display(),
        }
        for category in categories
    ]
    return Response(data)


@api_view(["GET", "PUT", "DELETE"])
def get_product(request, pk):
    product = get_object_or_404(Product, pk=pk)

    if request.method == "GET":
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)

    if not request.user.is_staff:
        return Response(
            {'detail': 'Admin privilege required to modify products.'},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "PUT":
        data = request.data
        if 'name' in data:
            product.name = data.get('name', product.name).strip()
        if 'description' in data:
            product.description = data.get('description', product.description).strip()
        if 'image' in data:
            product.image = data.get('image', product.image).strip()
        if 'price' in data:
            product.price = data.get('price', product.price)
        if 'rating' in data:
            product.rating = data.get('rating', product.rating)
        if 'reviews' in data:
            product.reviews = data.get('reviews', product.reviews)
        if 'stock' in data:
            product.stock = data.get('stock', product.stock)
        if 'badge' in data:
            product.badge = data.get('badge', product.badge)
        if 'category' in data:
            category_name = data.get('category')
            product.category = Category.objects.filter(name=category_name).first() if category_name else None

        product.save()
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)

    if request.method == "DELETE":
        product.delete()
        return Response({'detail': 'Product deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
