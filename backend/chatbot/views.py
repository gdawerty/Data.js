from asgiref.sync import sync_to_async
from django.shortcuts import render
from dotenv import load_dotenv
import os
import json
from django.http import JsonResponse
from .models import Transaction, Context

# Assume you have an Anthropic client library installed
from anthropic import Anthropic
from openai import OpenAI

# Create your views here.
async def chatbot(request):
    if request.method == 'POST':
        try:
            # Parse the incoming JSON request
            data = json.loads(request.body)
            prompt = data.get("prompt")

            # FIXME: REPLACE WITH REAL DATA
            system_prompt = (
                "You are a personal financial assistant. Generate separate response summaries addressing optimizations for Daily Purchases, Long-term Subscriptions, and Investments/Assets "
                "based on the income source/type, expenses source/type, and assets value/type. Each summary should be concise and relevant to their typical financial stake for an individual. "
                "- Single Expenses (string)\n"
                "- Recurring Expenses (string)\n"
                "- Assets (string)\n"
            )

            # Sample prompt input:
            # resident_text = "\n".join([
            #     f"- {p['name']} ({p['street']}, {p['city']}, {p['state']}) - "
            #     f"Disability: {p.get('disability', 'None')}, Info: {p.get('additional_info', 'N/A')}"
            #     for p in sorted(nearby_individuals, key=lambda x: x["distance_miles"])
            # ])
            context_text = "\n".join([
                f"- "
            ])
            

            formatted_prompt = (
                "Generate advice about spending in the short-term and long-term, always with the mindset of making smart financial choises."
                "The following information is some financial context about the user: \n" + 
                str(context_text) +
                ".\nAnd this is the transaction information that we have to support, so please be specific:\n" + 
                str()
            )
            
            # Create an Anthropics client instance using your API key from the environment
            anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            claude_model = "claude-3-5-sonnet-20241022"
            
            # Make the API call (this is an example; adjust as needed)
            response = anthropic_client.messages.create(
                model=claude_model,
                system=system_prompt,
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

async def pattern_recognition(request):
    print(request)
    if request.method == "POST":
        try:
            transactions = await get_transactions_str()
            
            message = (
                "Identify patterns in the user's spending. Qualities to look out for are over-spending, under-spending, "
                "unusual allocation of funds, and anomolies in terms of amounts/occurrances of categories. \n"
                "Based on the transactions, find financial weakpoints and generate recommendations that would leverage the user's spending habits.\n"
                "And Address \"the user\" as \"you\" to create a more conversational voice, with line breaks between recommendations to present the info clearly.\n\n"
                "Points of Interests Include:\n"
                "Buying goods in bulk or not, Perishability, Time of Season, Credit Card Rewards, "
                "Items of certain discounts/accessibility, inflation, or differentiating vendor prices.\n"
                "Focus more on the recommendations! Always pair advice with actual data from transactions, WITH NUMBERS.\n"
                "The following are the user's transaction data: \n"
                + transactions
            )

            openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            openai_model = "gpt-4o-mini"

            response = openai_client.chat.completions.create(
                model=openai_model,
                max_tokens=500,
                temperature=0.8, 
                messages=[{"role": "user", "content": message}]
            )
            if len(response.choices) == 0:
                return JsonResponse({"error": "Unexpected response type."}, status=500)
            return JsonResponse({"response": str(response.choices[0].message.content)}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"Failed to analyze patterns: {str(e)}"}, status=400)
    return JsonResponse({"error": "Invalid HTTP method."}, status=405)


async def transaction_insight(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            transaction_id = data.get("id")
            
            context = await get_context_str()
            transaction = await get_transaction_by_id(transaction_id)
            print("transaction", transaction)
            transactions = await get_transactions_str()

            system_prompt = (
                "The user has made this transaction.\n " + transaction + "\n"
                "This is what we known about the user's financial situation\n" + context + "\n"
                "This is what we known about the user's transaction history\n" + transactions + "\n"
                "Given this information, provide customized insight judging this transaction. Such as if it was expensive, their are better alternatives out there, etc. Rate whether it was a fine, decent, or great transaction, and give additonal information as needed."
                "Examples, that gives you a general idea of what I mean. `This is your 3rd time getting gas this week` or `gas prices in your area generally hover around ~ at this time. Consider ...` or `This is a really worth the money! Consider going here more often` ... etc"
            )
            anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            claude_model = "claude-3-5-sonnet-20241022"
            response = anthropic_client.messages.create(
                model=claude_model,
                system=system_prompt,
                max_tokens=500,
                messages=[{"role": "user", "content": system_prompt}]
            )
            if response.type != "message":
                return JsonResponse({"error": "Unexpected response type."}, status=500)
            return JsonResponse({"response": response.content[0].text}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"Failed to use chatbot to obtain initial context: {str(e)}"}, status=400)
    return JsonResponse({"error": "Invalid HTTP method."}, status=405)

def post_transaction(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            transaction = Transaction.objects.create(**data)
            transaction.save()
            return JsonResponse({"message": "Successfully added expense to database"})
        except Exception as e:
            return JsonResponse({"error": f"Failed to post transaction to database: {str(e)}"}, status=400)
    return JsonResponse({"error": "Invalid HTTP method."}, status=405)

def post_context(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            context = Context.objects.create(**data)
            context.save()
            return JsonResponse({"message": "Successfully added context to database"})
        except Exception as e:
            return JsonResponse({"error": f"Failed to post context to database: {str(e)}"}, status=400)
    return JsonResponse({"error": "Invalid HTTP method."}, status=405)

def get_transaction(request):
    if request.method == "GET":
        try:
            expenses = list(Transaction.objects.values())
            return JsonResponse({"expenses": expenses}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"Failed to get transaction to database: {str(e)}"}, status=400)
    return JsonResponse({"error": "Invalid HTTP method."}, status=405)

@sync_to_async
def get_transactions_str():
    transactions = Transaction.objects.all()
    transaction_str = "\n".join([f"- {t.date} - ${t.amount} - {t.category} - {t.description}" for t in transactions])
    return transaction_str

@sync_to_async
def get_transaction_by_id(id):
    transaction = Transaction.objects.get(id=id)
    return f"- {transaction.date} - ${transaction.amount} - {transaction.category} - {transaction.description}"

def get_context(request):
    if request.method == "GET":
        try:
            context = list(Context.objects.values())
            return JsonResponse({"expenses": context}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"Failed to get context to database: {str(e)}"}, status=400)
    return JsonResponse({"error": "Invalid HTTP method."}, status=405)

@sync_to_async
def get_context_str()->str:
    return Context.objects.all()[0].context