from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
   date = models.DateField()
   amount = models.DecimalField(max_digits=10, decimal_places=2)
   is_expense = models.BooleanField()
   category = models.CharField(max_length = 100)
   description = models.TextField(blank=True, null=True)
   user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
   
class Context(models.Model):
    income_amount = models.DecimalField(max_digits = 10, decimal_places=2)
    income_frequency = models.IntegerField()
    income_additional_context = models.TextField()
    assets_type = models.CharField(max_length=100)
    assets_amount = models.DecimalField(max_digits=10, decimal_places=2)
    assets_additional_context = models.TextField()
    location = models.TextField()