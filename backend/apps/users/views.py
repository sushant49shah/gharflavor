from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .serializers import (
    RegisterSerializer,
    UserAdminSerializer,
    UserSerializer,
    UserSerializerWithToken,
)


def authenticate_by_username_or_email(username, password):
    login_value = username.strip()
    user = authenticate(username=login_value, password=password)

    if user:
        return user

    try:
        matched_user = User.objects.get(email__iexact=login_value)
    except User.DoesNotExist:
        return None

    return authenticate(username=matched_user.username, password=password)


@api_view(["POST"])
def login_user(request):
    username = request.data.get("username") or request.data.get("email") or ""
    password = request.data.get("password") or ""
    user = authenticate_by_username_or_email(username, password)

    if user is None:
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


@api_view(["POST"])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response(UserSerializerWithToken(user, many=False).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    data = request.data

    if "name" in data:
        user.first_name = data.get("name", "").strip()
    if "email" in data:
        email = data.get("email", "").strip().lower()
        if User.objects.exclude(pk=user.pk).filter(email__iexact=email).exists():
            return Response({"detail": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        user.email = email
        user.username = email
    if data.get("password"):
        user.set_password(data["password"])

    user.save()
    return Response(UserSerializerWithToken(user, many=False).data)


@api_view(["GET", "POST"])
@permission_classes([IsAdminUser])
def users(request):
    if request.method == "GET":
        queryset = User.objects.all().order_by("-date_joined")
        return Response(UserAdminSerializer(queryset, many=True).data)

    serializer = UserAdminSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save(username=request.data.get("email", "").strip().lower())
    return Response(UserAdminSerializer(user, many=False).data, status=status.HTTP_201_CREATED)


@api_view(["PUT", "DELETE"])
@permission_classes([IsAdminUser])
def user_detail(request, pk):
    user = get_object_or_404(User, pk=pk)

    if request.method == "DELETE":
        user.delete()
        return Response({"detail": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    serializer = UserAdminSerializer(user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    updated_user = serializer.save()
    return Response(UserAdminSerializer(updated_user, many=False).data)
