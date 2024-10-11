from django.db import models

# Create your models here.

class Image(models.Model):
    imgName = models.TextField()
    createdBy = models.CharField(max_length=250)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.createdBy
