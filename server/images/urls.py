from django.urls import path
from .views import ImageListView, ImageDetailView






urlpatterns = [
    path("images/", ImageListView.as_view(), name="images_list"),
    path("images/<int:pk>/", ImageDetailView.as_view(), name="image_detail"),
]