import pandas as pd
import numpy as np

def load_and_clean_data(filepath="data/expenses.csv"):
    try:
        df = pd.read_csv(filepath)
    except FileNotFoundError:
        return pd.DataFrame()

    # Data Cleaning Phase
    df = df.dropna(subset=['Date', 'Amount', 'Category', 'Type'])
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df['Amount'] = pd.to_numeric(df['Amount'], errors='coerce')
    df['Category'] = df['Category'].astype(str).str.strip().str.title()
    df['Type'] = df['Type'].astype(str).str.strip().str.title()
    
    # Feature Engineering
    df['Month'] = df['Date'].dt.month_name()
    df['Weekday'] = df['Date'].dt.day_name()
    df['Month_Num'] = df['Date'].dt.month
    return df

def get_summary_metrics(df):
    if df.empty: return {}
    total_income = df[df['Type'] == 'Income']['Amount'].sum()
    total_expense = df[df['Type'] == 'Expense']['Amount'].sum()
    balance = float(total_income - total_expense)
    
    # Calculate current month metrics
    from datetime import datetime
    current_month_num = datetime.now().month
    current_year = datetime.now().year
    
    current_month_df = df[(df['Date'].dt.month == current_month_num) & (df['Date'].dt.year == current_year)]
    current_month_income = current_month_df[current_month_df['Type'] == 'Income']['Amount'].sum()
    current_month_expense = current_month_df[current_month_df['Type'] == 'Expense']['Amount'].sum()
    current_month_savings = current_month_income - current_month_expense
    
    return {
        "totalIncome": float(total_income),
        "totalExpense": float(total_expense),
        "balance": balance,
        "currentMonthIncome": float(current_month_income),
        "currentMonthExpense": float(current_month_expense),
        "currentMonthSavings": float(current_month_savings)
    }

def get_category_breakdown(df):
    if df.empty: return []
    expenses = df[df['Type'] == 'Expense']
    cat_sum = expenses.groupby('Category')['Amount'].sum().sort_values(ascending=False)
    
    return [{"name": index, "value": float(value)} for index, value in cat_sum.items()]

def get_monthly_trends(df):
    if df.empty: return []
    # Aggregate income and expense by month number
    monthly = df.groupby(['Month_Num', 'Month', 'Type'])['Amount'].sum().unstack(fill_value=0).reset_index()
    monthly = monthly.sort_values('Month_Num')
    
    trends = []
    for _, row in monthly.iterrows():
        trends.append({
            "name": row['Month'],
            "Income": float(row.get('Income', 0)),
            "Expense": float(row.get('Expense', 0))
        })
    return trends

def add_transaction(data: dict, filepath="data/expenses.csv"):
    # Append a new row to the CSV
    df = pd.DataFrame([data])
    df.to_csv(filepath, mode='a', header=not pd.io.common.file_exists(filepath), index=False)
