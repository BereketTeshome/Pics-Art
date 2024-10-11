from django.shortcuts import render
from .models import Product
from .Serializers import ProductSerializer
from rest_framework import generics
from django_filters import rest_framework as filters
# Create your views here.


class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')
    search = filters.CharFilter(field_name="title", lookup_expr='icontains')
    category = filters.AllValuesFilter(field_name='category')
    brand = filters.AllValuesFilter(field_name='brand')
    
    class Meta:
        model = Product
        fields = ("min_price", "max_price", "search", "category", "brand")

class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ProductFilter
    
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer