from django.shortcuts import render
from .models import Image
from .serializers import ImageSerializer
from rest_framework import generics
# from django_filters import rest_framework as filters
# Create your views here.


# class ImageFilter(filters.FilterSet):
#     min_price = filters.NumberFilter(field_name='price', lookup_expr='gte')
#     max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')
#     search = filters.CharFilter(field_name="title", lookup_expr='icontains')
#     category = filters.AllValuesFilter(field_name='category')
#     brand = filters.AllValuesFilter(field_name='brand')
    
#     class Meta:
#         model = Image
#         fields = ("min_price", "max_price", "search", "category", "brand")

class ImageListView(generics.ListCreateAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
   
    
class ImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer