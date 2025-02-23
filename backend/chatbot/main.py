from anthropic import Anthropic # claude client dependency
from dotenv import load_dotenv  # accessing os env vars
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os 
import json

from views import get_transaction

load_dotenv()

anthropic_client = Anthropic(api_key = os.getenv("ANTHROPIC_API_KEY"))
claude_model = "claude-3-5-sonnet-20241022"
#openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 3) Structure Data for AI prompt
financial_records = get_transaction()

print(financial_records)

# Create a multi-line string that lists each record.
# Here we sort the records by 'amount' (smallest to largest)
user_text = "\n".join([
    f"- {record['date']} | {record['category']} - Amount: ${record['amount']:.2f}, Notes: {record.get('notes', 'N/A')}"
    for record in sorted(financial_records, key=lambda x: x["amount"])
])

# Create the final user message that includes context and the user_text
user_message = (
    "I am creating an application that will enable users to input their expenses so AI can generate insights to save money. "
    "The following is the personal financial information for our user:\n\n"
    + user_text
)


user_message = (
    "I am creating an application that will enable users to input their expenses so AI can generate insights to save money. The following is financial information for our user:\n\n"
    + user_text
)

system_prompt = (
    "You are a personal financial assistant. Generate separate response summaries addressing optimizations for Daily Purchases, Long-term Subscriptions, and Investments/Assets "
    "based on the income source/type, expenses source/type, and assets value/type. Each summary should be concise and relevant to their typical financial stake for an individual. "
    "Return ONLY a valid JSON object with:\n"
    "- Single Expenses (string)\n"
    "- Recurring Expenses (string)\n"
    "- Assets (string)\n"
)

response = anthropic_client.messages.create(
    model=claude_model,
    max_tokens=500,
    system=system_prompt,
    messages=[
        {"role": "user", "content": user_message}
    ]
)
print(response.content[0].text)