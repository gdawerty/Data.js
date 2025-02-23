import os
import mysql.connector
from datetime import datetime
import matplotlib.pyplot as plt
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


# Helper function to fetch data
def fetch_transactions(year=None):
    query = """
    SELECT date, amount, is_expense 
    FROM chatbot_transaction 
    WHERE user_id = %s
    """
    params = (USER_ID,)
    if year:
        query += " AND YEAR(date) = %s"
        params = (USER_ID, year)
    cursor.execute(query, params)
    return cursor.fetchall()


# Calculate annual income and expenses
def calculate_annual_summary(year):
    transactions = fetch_transactions(year)
    income = 0
    expenses = 0
    for date, amount, is_expense in transactions:
        if is_expense:
            expenses += amount
        else:
            income += amount
    return income, expenses


# Calculate monthly income and expenses
def calculate_monthly_summary(year):
    monthly_income = [0] * 12
    monthly_expenses = [0] * 12
    transactions = fetch_transactions(year)
    for date, amount, is_expense in transactions:
        month = date.month - 1  # Convert to 0-based index
        if is_expense:
            monthly_expenses[month] += amount
        else:
            monthly_income[month] += amount
    return monthly_income, monthly_expenses


# Print annual income and expenses for the past 3 years
def print_annual_summary():
    current_year = datetime.today().year
    for year in range(current_year - 2, current_year + 1):
        income, expenses = calculate_annual_summary(year)
        print(f"Year: {year}")
        print(f"Total Income: ${income:.2f}")
        print(f"Total Expenses: ${expenses:.2f}")
        print(f"Net Savings: ${income - expenses:.2f}")
        print("-" * 30)


# Plot monthly income and expenses for the past 3 years
def plot_monthly_summary():
    current_year = datetime.today().year
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    plt.figure(figsize=(12, 6))
    for year in range(current_year - 2, current_year + 1):
        monthly_income, monthly_expenses = calculate_monthly_summary(year)
        plt.plot(months, monthly_income, label=f"Income {year}", marker='o')
        plt.plot(months, monthly_expenses, label=f"Expenses {year}", marker='o')

    plt.title("Monthly Income and Expenses (Past 3 Years)")
    plt.xlabel("Month")
    plt.ylabel("Amount ($)")
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()


# Run analytics
print_annual_summary()
plot_monthly_summary()

# Close the connection
cursor.close()
conn.close()