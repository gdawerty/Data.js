from django.contrib import admin
from .models import Transaction, Context

# Register your models here.

class TransactionAdmin(admin.ModelAdmin):
   list_display = ('date', 'amount', 'is_expense', 'category', 'description', 'user')  # Fields to display in the list view
admin.site.register(Transaction, TransactionAdmin)

class ContextAdmin(admin.ModelAdmin):
   display = 'context'
admin.site.register(Context, ContextAdmin)