from django.contrib import admin
from .models import Transaction, Context

# Register your models here.

class TransactionAdmin(admin.ModelAdmin):
   list_display = ('date', 'amount', 'is_expense', 'category', 'description', 'user')  # Fields to display in the list view
admin.site.register(Transaction, TransactionAdmin)

class ContextAdmin(admin.ModelAdmin):
   list_display = ('income_amount', 'income_frequency', 'income_additional_context', 'assets_type', 'assets_amount', 'assets_additional_context', 'location')
admin.site.register(Context, ContextAdmin)