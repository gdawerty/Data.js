from django.urls import path
from django.contrib.auth import views as auth_views
from django.views.decorators.csrf import csrf_exempt
from .views import chatbot, transaction_insight, post_transaction, post_context, get_transaction, get_context

urlpatterns = [
    path('api/chatbot/', csrf_exempt(chatbot), name='chatbot'),
    path('api/post_transaction', csrf_exempt(post_transaction), name = 'post_transaction'),
    path('api/post_context', csrf_exempt(post_context), name = 'post_context'),
    path('api/get_transaction', csrf_exempt(get_transaction), name = 'get_transaction'),
    path('api/get_context', csrf_exempt(get_context), name = 'get_context'),
    path('api/transaction_insight', csrf_exempt(transaction_insight), name = 'transaction_insight')
]