from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from .models import Review
from .serializer import ReviewSerializer
from apps.products.models import Product


# Create your views here.
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_reviews(request):
    reviews = Review.objects.select_related('product', 'user').all().order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request,pk):
    user = request.user
    
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=404)
    
    data = request.data
    
    # Check if user has already reviewed the product
    already_exists = product.review_set.filter(user=user).exists()
    if already_exists:
        return Response({'detail': 'Product already reviewed'}, status=400)
    
    # Check if rating is valid
    elif data['rating'] == 0:
        return Response({'detail': 'Please select a rating'}, status=400)
    
    # Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            rating=data['rating'],
            comment=data.get('comment', '')
        )
        reviews = product.review_set.all()
        product.reviews = len(reviews)
        
        total = 0
        for i in reviews:
            total += i.rating
            
        product.rating = total / len(reviews) if reviews else 0
        product.save()
        
        return Response({'detail': 'Review created'}, status=201)
