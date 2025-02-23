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

# nlp for obtaining context given what user is telling us 
import spacy
nlp = spacy.load("en_core_web_sm")

# Create your views here.
async def chatbot(request):
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({"error": "Request body cannot be empty."}, status=400)

            data = json.loads(request.body)
            prompt = data.get("prompt")
            print("prompt", prompt)
            
            context = await get_context_str()
            context = context if context else "No financial context available."
            transactions = await get_recent_transactions()
            
            conversation_history = data.get("history", [])
            conversation_history.append({"role": "user", "content": prompt})

            system_prompt = (
                "You are speaking directly to the user in the second person ('YOU'). "
                "Generate financial advice to help optimize their full financial potential. "
                "Reference specific financial principles and rules of thumb (e.g., 10-5-3 rule, 50-30-20 rule). "
                "Incorporate the user's financial history to create personalized insights and advice.\n\n"
                
                "User's financial context:\n"
                f"{context}\n\n"
                
                "Last 100 transactions:\n"
                f"{transactions}\n\n"
                
                "Ask for clarification when needed, especially regarding salary, living conditions, and other financial details, if there is little known about this person. "
                "Keep the conversation natural and engaging—messages should be short (max one paragraph) and cover only 1-2 topics at a time. Be friendly and supportive."
                "Ensure the user is not overwhelmed while still gathering necessary context. "
                "If the user shares anything new or significant, acknowledge and integrate it into the conversation."
            )
            
            anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            claude_model = "claude-3-5-sonnet-20241022"
            response = anthropic_client.messages.create(
                model=claude_model,
                system=system_prompt,
                max_tokens=500,
                messages=conversation_history
            )

            if response.type != "message":
                return JsonResponse({"error": "Unexpected response type."}, status=500)

            bot_response = response.content[0].text
            new_info = check_for_new_info(bot_response, context)
            if new_info:
                context = await post_context(new_info)
            return JsonResponse({"response": bot_response}, status=200)
        
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"error": str(e)}, status=500)
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

def check_for_new_info(bot_response, context):
    bot_doc = nlp(bot_response)
    context_doc = nlp(context)

    new_info = []
    financial_info = []

    for ent in bot_doc.ents:
        if ent.label_ in ["MONEY", "PERCENT", "DATE", "CARDINAL"]:
            financial_info.append(ent.text)

    for token in bot_doc:
        if token.text not in context_doc.text:
            new_info.append(token.text)

    extracted_info = financial_info if financial_info else new_info

    return " ".join(set(extracted_info)) if extracted_info else None

async def transaction_insight(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            transaction_id = data.get("id")
    
            context = await get_context_str()
            transaction = await get_transaction_by_id(transaction_id)
            print("transaction", transaction)
            transactions = await get_transactions_str()
            
            prompt = (
                "Generate some insights"
            )
            system_prompt = (
                "You are talking directly to the user, not me. Talk in second person. 'YOU' address the user. " +  
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
                messages=[{"role": "user", "content": prompt}]
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

@sync_to_async
def post_context(request):
    try:
        context = Context.objects.create(context=request)
        context.save()
        return JsonResponse({"message": "Successfully added context to database"})
    except Exception as e:
        return JsonResponse({"error": f"Failed to post context to database: {str(e)}"}, status=400)
    
def get_context(request):
    if request.method == "GET":
        try:
            context = list(Context.objects.values())
            return JsonResponse({"expenses": context}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"Failed to get context to database: {str(e)}"}, status=400)
    return JsonResponse({"error": "Invalid HTTP method."}, status=405)

@sync_to_async
def get_context_str() -> str:
    try:
        context = Context.objects.first()
        if context:
            return context.context
        else:
            return "No financial context available."
    except Exception as e:
        print(f"Error fetching context: {e}")
        return "Error fetching context data."
    
@sync_to_async
def get_recent_transactions():
    transactions = Transaction.objects.all().order_by('-date')[:10]
    transaction_str = ""
    for transaction in transactions:
        transaction_type = "Expense" if transaction.is_expense else "Income"
        transaction_str += f"Date: {transaction.date}, Amount: {transaction.amount} ({transaction_type}), Category: {transaction.category}, Description: {transaction.description if transaction.description else 'No description'}\n"
    return transaction_str if transaction_str else "No recent transactions available."