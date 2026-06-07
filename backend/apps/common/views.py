from .models import ContactMessage
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['POST'])
def contact_message(request):
    data = request.data
    ContactMessage.objects.create(
        full_name=data.get('full_name', '').strip(),
        email=data.get('email', '').strip(),
        phone=data.get('phone', '').strip(),
        inquiry_type=data.get('inquiry_type', '').strip(),
        message=data.get('message', '').strip(),
    )
    return Response({'detail': 'Message sent successfully.'}, status=201)