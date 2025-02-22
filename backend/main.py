from anthropic import Anthropic # claude client dependency
from dotenv import load_dotenv  # accessing os env vars
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os 
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow frontend to access API
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

load_dotenv()

anthropic_client = Anthropic(api_key = os.getenv("ANTHROPIC_API_KEY"))
claude_model = "claude-3-5-sonnet-20241022"
#openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 3) Structure Data for AI prompt
financial_records = [
    {
        "category": "Rent",
        "amount": 1200.00,
        "date": "2023-09-01",
        "notes": "Monthly apartment rent"
    },
    {
        "category": "Groceries",
        "amount": 350.00,
        "date": "2023-09-05",
        "notes": "Weekly grocery shopping"
    },
    {
        "category": "Utilities",
        "amount": 150.00,
        "date": "2023-09-10",
        "notes": "Electricity and water bills"
    },
    {
        "category": "Transportation",
        "amount": 75.00,
        "date": "2023-09-08",
        "notes": "Monthly bus pass"
    },
]

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