from django.shortcuts import render
from dotenv import load_dotenv
import os
import json
from django.http import JsonResponse

# Assume you have an Anthropic client library installed
from anthropic import Anthropic

# Create your views here.

def chatbot(request):
    print(request)
    if request.method == 'POST':
        try:
            # Parse the incoming JSON request
            data = json.loads(request.body)
            prompt = data.get("prompt", "")
            if not prompt:

                return JsonResponse({"error": "No prompt provided."}, status=400)
            
            # Format the prompt as required by the Anthropics API
            formatted_prompt = f"Human: {prompt}\n\nAssistant:"
            
            # Create an Anthropics client instance using your API key from the environment
            anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            claude_model = "claude-3-5-sonnet-20241022"
            
            # Make the API call (this is an example; adjust as needed)
            response = anthropic_client.messages.create(
                model=claude_model,
                max_tokens=500,
                messages=[{"role": "user", "content": formatted_prompt}]
            )
            
            # Check for errors from the API call
            if response.status_code != 200:
                return JsonResponse({
                    "error": "Anthropic API error",
                    "details": response.json()
                }, status=response.status_code)
            
            # Return the successful response as JSON
            return JsonResponse(response.json())
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    # Only allow POST requests
    return JsonResponse({"error": "Invalid HTTP method."}, status=405)