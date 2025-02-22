from django.urls import path
from django.contrib.auth import views as auth_views
from django.views.decorators.csrf import csrf_exempt
from .views import chatbot

urlpatterns = [
    path('api/chatbot/', csrf_exempt(chatbot), name='chatbot'),
]

#from chatbot import views

