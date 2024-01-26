from .views import *
from django.urls import path




urlpatterns = [
    path("signup/",SignUpView.as_view(),name="sign_up"),    
    path("signin/",SignInView.as_view(),name="sign_in"),
    path("movies/",MoviesView.as_view(),name="movie-view"), 
    path("movies/<int:id>/",MoviesView.as_view(),name="movie-details"),
    path("movies/genres/", GenreList.as_view(), name='genre-list'),
    path("movies/<int:movie_id>/add_theater/", TheaterCreateView.as_view(), name='add-theater-to-movie'),
    path("movie/the/<int:id>/", GetTheaterDetailsViews.as_view(), name='Theater-Details'),
    path("movies/showtime/<int:movie_id>/", AvailableShowTimes.as_view(), name='Available-show-time'),
    path("movies/book-seat/", SeatBookingView.as_view(), name='book-seat'),
    path('delete-seat/', DeleteSeatView.as_view(), name='Delete-seat'),
    path('reserved-seats/<int:theater_id>/<int:movie_id>/<str:date>/<str:movie_timing>/', BookedSeatView.as_view(), name='reserved-seats-list'),
    path("movies/tickets/", BookingDetailsView.as_view(), name='book-Tickets-details'),
    
]





