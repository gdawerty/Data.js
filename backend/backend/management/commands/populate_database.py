import os
import mysql.connector
from datetime import datetime, timedelta
import random
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database credentials
db_config = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME')
}

# Connect to the database
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

# Constants
USER_ID = 1
INCOME_CATEGORIES = ["Salary", "Investment Returns", "Dividends", "Gifts", "Interest Income"]
EXPENSE_CATEGORIES = ["Groceries", "Utilities", "Mortgage", "Transportation", "Dining", 
                      "Entertainment", "Travel", "Insurance", "Clothing", "Subscriptions", "Personal"]

# Random descriptions
GROCERY_STORES = ["Whole Foods", "Trader Joe's", "Walmart", "Kroger", "Aldi"]
RESTAURANTS = ["McDonald's", "Starbucks", "Olive Garden", "Chipotle", "Pizza Hut", 
               "Subway", "Taco Bell", "Burger King", "Domino's", "Panera Bread", 
               "Chick-fil-A", "Dunkin' Donuts", "Applebee's", "Buffalo Wild Wings", "Panda Express"]
ENTERTAINMENT_ACTIVITIES = ["Movie Theater", "Concert", "Amusement Park", "Bowling", 
                            "Escape Room", "Karaoke", "Arcade", "Zoo", "Museum", "Theater Show"]
CLOTHING_STORES = ["Nike", "H&M", "Zara", "Uniqlo", "Gap"]
TRAVEL_DESTINATIONS = ["Paris", "Tokyo", "New York", "Bali", "London", "Sydney", "Rome", "Dubai"]

# Helper functions
def random_amount(min_amount, max_amount):
    return round(random.uniform(min_amount, max_amount), 2)

def random_date(start_date, end_date):
    delta = end_date - start_date
    random_days = random.randrange(delta.days)
    return start_date + timedelta(days=random_days)

def insert_transaction(date, amount, is_expense, category, description):
    query = """
    INSERT INTO chatbot_transaction (amount, is_expense, category, description, user_id, date)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (amount, is_expense, category, description, USER_ID, date))
    conn.commit()

# Generate income data
def generate_income():
    today = datetime.today()
    three_years_ago = today - timedelta(days=3*365)

    # Salary
    for month in range(36):
        date = three_years_ago + timedelta(days=30 * month)
        date = date.replace(day=10)
        if month < 18:
            amount = 7500
        elif month < 24:
            amount = 8833
        else:
            amount = 9138
        insert_transaction(date, amount, 0, "Salary", "Monthly Salary")

    # Investment Returns
    for year in range(3):
        date = three_years_ago.replace(year=three_years_ago.year + year, month=1, day=1)
        amount = random_amount(2000, 3000)
        insert_transaction(date, amount, 0, "Investment Returns", "Annual Investment Returns")

    # Gifts
    for year in range(3):
        date = three_years_ago.replace(year=three_years_ago.year + year, month=12, day=25)
        amount = random_amount(200, 300)
        insert_transaction(date, amount, 0, "Gifts", "Holiday Gift")

    # Interest Income
    for month in range(36):
        date = three_years_ago + timedelta(days=30 * month)
        date = date.replace(day=2)
        amount = random_amount(100, 200)
        insert_transaction(date, amount, 0, "Interest Income", "Monthly Interest Income")

# Generate expense data
def generate_expenses():
    today = datetime.today()
    three_years_ago = today - timedelta(days=3*365)

    # Mortgage
    for month in range(36):
        date = three_years_ago + timedelta(days=30 * month)
        if month < 12:
            date = date.replace(day=10)
            amount = 1100
        else:
            date = date.replace(day=15)
            amount = 1600
        insert_transaction(date, amount, 1, "Mortgage", "Monthly Mortgage Payment")

    # Utilities
    for month in range(36):
        date = three_years_ago + timedelta(days=30 * month)
        date = date.replace(day=20)
        amount = random_amount(200, 300)
        insert_transaction(date, amount, 1, "Utilities", "Monthly Utilities Bill")

    # Groceries
    current_date = three_years_ago
    while current_date < today:
        days_between = random.randint(5, 10)
        current_date += timedelta(days=days_between)
        amount = random_amount(80, 150)
        description = f"Groceries at {random.choice(GROCERY_STORES)}"
        insert_transaction(current_date, amount, 1, "Groceries", description)

    # Transportation
    current_date = three_years_ago
    while current_date < today:
        if current_date.weekday() == 4:  # Friday
            amount = random_amount(75, 125)
            insert_transaction(current_date, amount, 1, "Transportation", "Weekly Transportation Cost")
        current_date += timedelta(days=1)

    # Dining
    current_date = three_years_ago
    while current_date < today:
        days_between = random.randint(2, 3)
        current_date += timedelta(days=days_between)
        amount = random_amount(10, 20)
        description = f"Dining at {random.choice(RESTAURANTS)}"
        insert_transaction(current_date, amount, 1, "Dining", description)

    # Entertainment
    current_date = three_years_ago
    while current_date < today:
        days_between = random.randint(14, 21)
        current_date += timedelta(days=days_between)
        amount = random_amount(30, 50)
        description = f"{random.choice(ENTERTAINMENT_ACTIVITIES)}"
        insert_transaction(current_date, amount, 1, "Entertainment", description)

    # Insurance
    for month in range(36):
        date = three_years_ago + timedelta(days=30 * month)
        date = date.replace(day=18)
        amount = 1333
        insert_transaction(date, amount, 1, "Insurance", "Monthly Insurance Payment")

    # Clothing
    current_date = three_years_ago
    while current_date < today:
        days_between = random.randint(30, 50)
        current_date += timedelta(days=days_between)
        amount = random_amount(100, 200)
        description = f"Clothing at {random.choice(CLOTHING_STORES)}"
        insert_transaction(current_date, amount, 1, "Clothing", description)

    # Travel
    for year in range(3):
        date = three_years_ago.replace(year=three_years_ago.year + year)
        date = date.replace(month=random.randint(5, 8), day=random.randint(1, 28))
        amount = random_amount(2000, 3000)
        description = f"Travel to {random.choice(TRAVEL_DESTINATIONS)}"
        insert_transaction(date, amount, 1, "Travel", description)

    # Subscriptions
    for month in range(36):
        date = three_years_ago + timedelta(days=30 * month)
        date = date.replace(day=1)
        amount = 15
        insert_transaction(date, amount, 1, "Subscriptions", "Monthly Subscription Fee")

    # Personal
    for month in range(36):
        date = three_years_ago + timedelta(days=30 * month)
        date = date.replace(day=random.randint(1, 28))
        amount = random_amount(40, 60)
        insert_transaction(date, amount, 1, "Personal", "Personal Expense")

# Generate data
generate_income()
generate_expenses()


# Print number of transactions
query = """
SELECT COUNT(*) FROM chatbot_transaction
"""
cursor.execute(query)
result = cursor.fetchone()
print(f"Number of transactions: {result[0]}")

# Close the connection
cursor.close()
conn.close()


print("Data population complete.")