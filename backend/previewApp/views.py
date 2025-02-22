from django.shortcuts import render

def index(request):
    # This message could be output from your logic or even a print capture.
    # For now, we simply define a string.
    message = "Hello, this is your temporary UI showing prints on localhost:8000!"
    
    # Pass the message to the template context
    return render(request, 'index.html', {'message': message})

def chatbot(request):
    message = "Hello! I am your personal accounting asssistant. You have a lot of data ong.\nLet's get that checked out."
    return render(request, 'index.html', {'message' : message})