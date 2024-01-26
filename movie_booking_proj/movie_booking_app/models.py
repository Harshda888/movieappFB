from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError('username is required')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)


    

class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=200,unique=True)
    email = models.EmailField(default='null',unique=True)
    password = models.CharField(max_length=200)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)    
    

    USERNAME_FIELD = 'username'
    objects = UserManager()

    def __str__(self):
        return self.username
    
    def has_perm(self,perm,obj=None):
        return self.is_superuser
    
    def has_module_perms(self,app_label):
        return self.is_superuser
    


    

class Movie(models.Model):
    title = models.CharField(max_length=255)
    genre = models.CharField(max_length=100)
    director = models.CharField(max_length=255)
    description = models.TextField()
    image = models.TextField()
    language = models.CharField(max_length=255)
    movie_length = models.IntegerField()
    rating = models.FloatField()
    release_date = models.DateField(default=None,null=True)
    
    def __str__(self):
        return self.title
    




class Theater(models.Model):
    movie = models.ForeignKey(Movie, on_delete = models.CASCADE, related_name="movie")
    name = models.CharField(max_length=250)
    address = models.CharField(max_length=250)
    city = models.CharField(max_length=250)
    pincode = models.IntegerField()
    first_show= models.TimeField(blank=True, null=True)
    second_show= models.TimeField(blank=True, null=True)
    third_show= models.TimeField(blank=True, null=True)
    date=models.DateField() 
    def __str__(self) -> str:
        return self.name
    


    
class Seat(models.Model):
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, related_name="theaters")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    seat_number = models.CharField(max_length=255)
    is_reserved = models.BooleanField(default=False)
    category = models.CharField(max_length=255)
    price = models.FloatField(default=0.00)
    date = models.CharField(max_length=10)
    movie_timing = models.CharField(max_length=10, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.theater.name} - {self.movie.title } - {self.seat_number}"
    





class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    seats = models.ManyToManyField(Seat)
    total_cost = models.IntegerField(default=0.00)
    
    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"