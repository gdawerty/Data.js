from django.shortcuts import render
from dotenv import load_dotenv
import os
import json
from django.http import JsonResponse

# Assume you have an Anthropic client library installed
from anthropic import Anthropic

# Create your views here.


async def chatbot(request):
    if request.method == 'POST':
        try:
            # Parse the incoming JSON request
            data = json.loads(request.body)
            prompt = data.get("prompt")

            # FIXME: REPLACE WITH REAL DATA
            formatted_prompt = ("Financial Records\n" + "Date | Category - Amount: $X.XX, Notes: Y\n" + "-----------------------------\n" +
                                "2023-09-01 | Rent - Amount: $1200.00, Notes: Monthly apartment rent\n" +
                                "2023-09-05 | Groceries - Amount: $350.00, Notes: Weekly grocery shopping\n" +
                                "2023-09-10 | Utilities - Amount: $150.00, Notes: Electricity and water bills\n" +
                                "2023-09-08 | Transportation - Amount: $75.00, Notes: Monthly bus pass\n" +
                                "-----------------------------\n" +
                                "Saving Goal: $500.00\n" +
                                "Current Balance: $1000.00\n" +
                                "-----------------------------\n" +
                                str(prompt))
            print("formatted prompt", formatted_prompt)
            # Create an Anthropics client instance using your API key from the environment
            anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            claude_model = "claude-3-5-sonnet-20241022"
            
            # Make the API call (this is an example; adjust as needed)
            response = anthropic_client.messages.create(
                model=claude_model,
                max_tokens=500,
                messages=[{"role": "user", "content": formatted_prompt}]
            )

            print("anthropic response", response.json())

            if response.type != "message":
                return JsonResponse({"error": "Unexpected response type."}, status=500)

            # Return the successful response as JSON
            return JsonResponse({"response": response.content[0].text}, status=200)
        
        except Exception as e:
            print("error", e)
            return JsonResponse({"error": str(e)}, status=500)
    
    # Only allow POST requests
    return JsonResponse({"error": "Invalid HTTP method."}, status=405)