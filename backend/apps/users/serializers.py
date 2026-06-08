from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source="id", read_only=True)
    name = serializers.SerializerMethodField()
    isAdmin = serializers.BooleanField(source="is_staff", read_only=True)

    class Meta:
        model = User
        fields = ("id", "_id", "username", "email", "name", "isAdmin")

    def get_name(self, obj):
        return obj.get_full_name() or obj.first_name or obj.username


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField()
    refresh = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ("token", "refresh")

    def get_token(self, obj):
        return get_tokens_for_user(obj)["access"]

    def get_refresh(self, obj):
        return get_tokens_for_user(obj)["refresh"]


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def validate_email(self, value):
        email = value.lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email

    def create(self, validated_data):
        name = validated_data["name"].strip()
        email = validated_data["email"]
        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data["password"],
            first_name=name,
        )
        return user


class UserAdminSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source="id", read_only=True)
    name = serializers.CharField(source="first_name", required=False, allow_blank=True)
    isAdmin = serializers.BooleanField(source="is_staff", required=False)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True, min_length=6)

    class Meta:
        model = User
        fields = ("id", "_id", "username", "email", "name", "isAdmin", "password")
        extra_kwargs = {
            "username": {"required": False, "allow_blank": True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password", "")
        user = User(**validated_data)
        if not user.username:
            user.username = user.email
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", "")
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
