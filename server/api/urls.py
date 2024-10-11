# api/urls.py
from django.urls import path
from .views import get_image_description

urlpatterns = [
    path('image-description/', get_image_description, name='image_description'),
]
