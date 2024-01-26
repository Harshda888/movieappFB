from rest_framework import serializers
from .models import *
from .serializers import *
from django.contrib.auth import authenticate



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password','email','name')

    def create(self, validated_data):
        user = User.objects.create_user (
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            name=validated_data['name'],
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)

        if user and user.is_active:
            return user

        raise serializers.ValidationError("Incorrect credentials")
    

    
class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = "__all__"


class TheaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = "__all__"


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = "__all__"

class BookingSerializer(serializers.ModelSerializer):
    seats = SeatSerializer(many=True,read_only=True)
    user = serializers.StringRelatedField() 
    # the o/p of user is in str formant  rather than a detailed serialization of the related model. 
    movie = MovieSerializer()

    class Meta:
        model = Booking
        fields = "__all__"




