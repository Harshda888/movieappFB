from django.http import Http404, HttpResponseBadRequest
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import *
from .models import *
from django.core.paginator import Paginator
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from django.views import View
from rest_framework import status
import json
from rest_framework import generics


# VIEWS for UserAuthentication

class SignUpView(APIView):

    def post(self, request):
        data= json.loads(request.body)
        userExist = User.objects.filter(email=data["email"])
        if not userExist:
            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message":"Account Created Successfully"}, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message":"Account Already Exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    
class SignInView(APIView):

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data

            refresh_token = RefreshToken.for_user(user)
            access_token_exp = refresh_token.access_token.payload["exp"]

            return Response(
                {
                'refresh_token': str(refresh_token),
                'access': str(refresh_token.access_token),
                'acess_token_exp': access_token_exp,
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        
    

class UserView(APIView):

    def put(self, request, id):
        data = json.loads(request.body)

        try:
            user_to_update = next(item for item in data if item["id"] == id)
        except StopIteration:
            return HttpResponseBadRequest("User not found")

        serializer = UserSerializer(user_to_update, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return HttpResponseBadRequest(serializer.errors)

        
        
    def delete(self, request, id):
        user = self.get_object(id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
    
class MoviesView(APIView):

    def get_permissions(self):
        if self.request.method in ["POST", "DELETE","PUT"]:
            return[IsAuthenticated(), IsAdminUser()]
        return[]
    

    def get(self, request, id=None):
        if id:
            try:
                movie = Movie.objects.get(id=id)
                serializer = MovieSerializer(movie).data
                return Response(serializer, status=status.HTTP_200_OK)
            except Movie.DoesNotExist:  
                return Response({"message": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)
    
        query = request.GET.get("query", None)
        rating = request.GET.get("rating", None)
        genre = request.GET.get("genre", None)
        language = request.GET.get("language", None)
        page_no = request.GET.get("page", None)
        allMovies = Movie.objects.all().order_by("id")

        if query:
            allMovies = allMovies.filter(
            Q(title_icontains=query) | Q(description_icontains=query))
        if rating:
            allMovies = allMovies.filter(
            rating__gte=int(rating))
        if genre:
            allMovies = allMovies.filter(
            genre__icontains=genre)
        if language:
            allMovies = allMovies.filter(
            Q(language__in=language.split("|")) | Q(language__icontains=language))

        paginate = Paginator(allMovies, 6)
        page = paginate.get_page(page_no)
        page_data = page.object_list
        serializer = MovieSerializer(page_data, many=True).data
        return Response(
        {
            "count": allMovies.count(),
            "total_page": paginate.num_pages,
            "next": page.has_previous(),
            "previous": page.has_previous(),
            "data": serializer,
        },
        status=status.HTTP_200_OK,
    )

    

    def post(self, request):
        data= request.data
        serializer = MovieSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    

    def put(self,request,id=None):
        try:
            movie= Movie.objects.get(id=id)
        except Movie.DoesNotExist:
            return Response({"message":"movie not found"},status=status.HTTP_404_NOT_FOUND)
        
        serializer = MovieSerializer(movie,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    


    def delete(self,request,id=None):
        try:
            movie = Movie.objects.get(id=id)
            movie.delete()
            return Response({"message":"movie deleted"},status=status.HTTP_200_OK)
        except Movie.DoesNotExist:
            return Response({"message":"movie not found"},status=status.HTTP_404_)



    
class GenreList(APIView):
    def get(self, request, format=None):
      
        unique_genres = Movie.objects.values_list('genre', flat=True).distinct()
        # Convert the QuerySet to a list
        genre_list = list(unique_genres)
        return Response(genre_list, status=status.HTTP_200_OK) 


class TheaterCreateView(APIView):
    def post(self, request, movie_id):
        print(request.data)
        try:
            movie = Movie.objects.get(id=movie_id)
            request.data['movie'] = movie_id
        except Movie.DoesNotExist:
            return Response({"message": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TheaterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(movie=movie)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class GetTheaterDetailsViews(APIView):
    def get(self, request, id):
        try:
            product = Theater.objects.get(movie=id)
            serializer = TheaterSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Movie.DoesNotExist:
            return Response({"detail": "Theater not found"}, status=status.HTTP_404_NOT_FOUND)


class AvailableShowTimes(APIView):
    def get(self, request, movie_id):
        try:
            theaters = Theater.objects.filter(movie_id=movie_id)
            available_show_times = []

            for theater in theaters:
                show_times = {
                    'theater_id': theater.id,
                    'first_show': theater.first_show,
                    'second_show': theater.second_show,
                    'third_show': theater.third_show,
                }
                available_show_times.append(show_times)

            return Response(available_show_times, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class SeatBookingView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        data = request.data
        theater_id = data.get('theater')
        seats_data = data.get('seats')
        category = data.get('category')
        movie_id = data.get('movie')
        price = data.get('price')
        movie_timing=data.get('movie_timing')
        date=data.get('date')
        
        # Create the Booking object
        booking = Booking(user=request.user, movie_id=movie_id,total_cost=len(seats_data)*price)
        booking.save()

        # Create Seat objects for each seat in the list
        for seat_number in seats_data:
            seat = Seat(
                theater_id=theater_id,
                movie_id=movie_id,
                seat_number=seat_number,
                category=category,
                price=price,
                is_reserved=True,
                movie_timing= movie_timing,
                date=date,
                user=request.user
            )
            seat.save()
            booking.seats.add(seat)

        return Response({'message': 'Booking created successfully'}, status=status.HTTP_201_CREATED)





class BookedSeatView(APIView):
    def get(self, request, theater_id, movie_id, date, movie_timing):

        queryset = Seat.objects.filter(
            theater_id=theater_id,
            movie_id=movie_id,
            date=date,
            movie_timing=movie_timing,
            is_reserved=True  # Filter only reserved seats
        )
        
        # serializer = SeatSerializer(queryset, many=True)
        seat_numbers = [seat.seat_number for seat in queryset]
        # You can customize the response data here if needed
        response_data = {
            # 'reserved_seats': serializer.data
            'reserved_seat_numbers': seat_numbers
        }

        return Response(response_data)
    


class BookingDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        date_param = request.GET.get('date', None)
        if date_param is None:
            seats = Seat.objects.filter(user_id=user)
        else:
            seats = Seat.objects.filter(user_id=user, date=date_param).values(
                    'id','theater_id','movie_id','seat_number','is_reserved','category','price','date','movie_timing','user_id')
        user_serializer = UserSerializer(user).data
        seat_serializer = SeatSerializer(seats, many=True).data
        theater_ids = seats.values_list('theater_id',flat=True).distinct()
        theater_id_list = list(theater_ids)
        print(theater_ids)
        theaters = Theater.objects.filter(id=theater_id_list[0])
        theater_serializer = TheaterSerializer(theaters, many=True).data
        # booking=Booking.objects.filter(user_id=user,movie_id=)
        # print(booking)
        response_data = {
            'user_details': user_serializer,
            'seat_details': seat_serializer,
            'theater_details': theater_serializer,
        }
        return Response(response_data)


class DeleteSeatView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        data = request.data
        print(data)
        user_id = request.user.id
        movie_id = data.get('movie_id')  
        seat_number = data.get('seat_number') 
        date = data.get('date') 
 
        seats=Seat.objects.all()
        seat_to_delete=seats.filter(seat_number=seat_number)
        
        seat_to_delete.delete()
        return Response({'message': 'Seat data deleted successfully'}, status=status.HTTP_200_OK)
    # except Seat.DoesNotExist:
    #     return Response({'error': 'Seat data not found'}, status=status.HTTP_404_NOT_FOUND)