from django.db import models
# import uuid

# Create your models here.





class Product(models.Model):
    # id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    img  = models.CharField(max_length=9999)
    brand = models.CharField(max_length=100)
    title = models.CharField(max_length=150)
    rating = models.FloatField()
    price = models.IntegerField()
    description = models.TextField()
    category = models.CharField(max_length=100)
    featured = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title