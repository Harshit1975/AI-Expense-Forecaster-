from fastapi import FastAPI, Header, Query
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from data_generator import generate_synthetic_data
from data_processor import load_and_clean_data, get_summary_metrics, get_category_breakdown, get_monthly_trends
import os
import pandas as pd

def get_user_file(x_user: Optional[str]) -> str:
    user = x_user or "default"
    user = "".join([c for c in user if c.isalnum() or c in ('_', '-')])
    if not user:
        user = "default"
    file_path = f"data/expenses_{user}.csv"
    if not os.path.exists(file_path):
        os.makedirs("data", exist_ok=True)
        df = pd.DataFrame(columns=["Date","Category","Description","Amount","Type"])
        df.to_csv(file_path, index=False)
    return file_path

app = FastAPI(title="Expense Tracker API")

# Allow requests from our React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Phase 2: Create dataset if it doesn't exist
    generate_synthetic_data("data/expenses.csv")

@app.get("/api/dashboard")
def get_dashboard_data(x_user: Optional[str] = Header(None)):
    df = load_and_clean_data(get_user_file(x_user))
    
    return {
        "status": "success",
        "metrics": get_summary_metrics(df),
        "categoryBreakdown": get_category_breakdown(df),
        "monthlyTrends": get_monthly_trends(df)
    }

@app.get("/api/transactions")
def get_recent_transactions(x_user: Optional[str] = Header(None)):
    df = load_and_clean_data(get_user_file(x_user))
    if df.empty: return {"transactions": []}
    
    # Return last 10 transactions
    recent = df.sort_values(by="Date", ascending=False).head(10)
    # Ensure Date is converted to string for JSON serialization
    recent['Date'] = recent['Date'].dt.strftime('%Y-%m-%d')
    return {"transactions": recent.to_dict(orient="records")}
from typing import Optional
from pydantic import BaseModel

class Transaction(BaseModel):
    Date: str
    Category: str
    Description: str
    Amount: float
    Type: str

@app.post("/api/transaction")
def create_transaction(txn: Transaction, x_user: Optional[str] = Header(None)):
    from data_processor import add_transaction
    add_transaction(txn.dict(), get_user_file(x_user))
    return {"status": "success", "message": "Transaction added"}

class SimulationRequest(BaseModel):
    num_transactions: int = 50
    target_savings: float = 0.0

@app.post("/api/simulate")
def simulate_data(req: SimulationRequest, x_user: Optional[str] = Header(None)):
    import pandas as pd
    import numpy as np
    import random
    from datetime import datetime, timedelta
    from data_processor import add_transaction
    
    file_path = get_user_file(x_user)
    
    categories = [
        'Food & Dining', 'Groceries', 'Housing & Rent', 'Auto & Transport', 
        'Utilities & Bills', 'Health & Fitness', 'Shopping & Retail', 
        'Entertainment', 'Personal Care', 'Travel & Vacation', 'Education'
    ]
    
    # We will track expenses per month to calculate the required income
    monthly_expenses = {}
    
    # We simulate over current month and 2 past months
    # To keep it realistic, we'll force some transactions in the current month
    current_date = datetime.now()
    
    for _ in range(req.num_transactions):
        # Weighted random date leaning towards recent days
        days_ago = int(np.random.gamma(shape=2, scale=15)) % 90
        date = current_date - timedelta(days=days_ago)
        
        category = random.choice(categories)
        amount = round(np.random.uniform(10, 500) if category != 'Housing & Rent' else np.random.uniform(1000, 3000), 2)
        desc = f"Simulated {category} expense"
        
        txn = {
            "Date": date.strftime('%Y-%m-%d'),
            "Category": category,
            "Description": desc,
            "Amount": amount,
            "Type": "Expense"
        }
        add_transaction(txn, file_path)
        
        month_key = date.strftime('%Y-%m')
        monthly_expenses[month_key] = monthly_expenses.get(month_key, 0) + amount
        
    # Inject exactly ONE income transaction per simulated month to yield the target saving
    for month_key, total_exp in monthly_expenses.items():
        required_income = round(total_exp + req.target_savings, 2)
        income_date = f"{month_key}-01" # First day of the month
        
        txn = {
            "Date": income_date,
            "Category": "Salary & Income",
            "Description": "Calculated Simulated Salary",
            "Amount": required_income,
            "Type": "Income"
        }
        add_transaction(txn, file_path)
        
    return {"status": "success", "message": f"Simulated {req.num_transactions} expenses & verified savings"}

from fastapi.responses import FileResponse
import os

@app.get("/api/predict")
def predict_expenses(x_user: Optional[str] = Header(None)):
    df = load_and_clean_data(get_user_file(x_user))
    if df.empty: return {"forecast_day": None, "message": "No data"}
    
    total_income = df[df['Type'] == 'Income']['Amount'].sum()
    total_expense = df[df['Type'] == 'Expense']['Amount'].sum()
    balance = total_income - total_expense
    
    if balance <= 0:
        return {"forecast_day": "today", "message": "Success"}
        
    expenses = df[df['Type'] == 'Expense'].copy()
    if len(expenses) < 5:
        return {"forecast_day": None, "message": "Not enough data for ML"}
        
    daily = expenses.groupby('Date')['Amount'].sum().reset_index()
    daily = daily.sort_values('Date')
    
    start_date = daily['Date'].min()
    daily['Days'] = (daily['Date'] - start_date).dt.days
    
    from sklearn.linear_model import LinearRegression
    X = daily[['Days']]
    y = daily['Amount']
    
    model = LinearRegression()
    model.fit(X, y)
    
    last_date = daily['Date'].max()
    last_day = daily['Days'].max()
    
    from datetime import timedelta
    current_balance = balance
    days_to_deplete = 0
    
    for i in range(1, 365):
        prediction = model.predict([[last_day + i]])[0]
        predicted_expense = max(0, prediction)
        current_balance -= predicted_expense
        if current_balance <= 0:
            days_to_deplete = i
            break
            
    if current_balance > 0:
        return {"forecast_day": "safely over a year", "message": "Success"}
        
    target_date = last_date + timedelta(days=days_to_deplete)
    
    day = target_date.day
    if 4 <= day <= 20 or 24 <= day <= 30:
        suffix = "th"
    else:
        suffix = ["st", "nd", "rd"][day % 10 - 1]
    
    month_name = target_date.strftime("%B")
    
    return {"forecast_day": f"{day}{suffix} of {month_name}", "message": "Success"}

@app.get("/api/export/csv")
def export_csv(user: Optional[str] = Query(None)):
    file_path = get_user_file(user)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="text/csv", filename="FinSight_Transactions.csv")
    return {"error": "File not found"}

@app.get("/api/export/pdf")
def export_pdf(user: Optional[str] = Query(None)):
    from fpdf import FPDF
    df = load_and_clean_data(get_user_file(user))
    
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=16, style='B')
    pdf.cell(200, 15, txt="FinSight Data Science Financial Report", ln=1, align='C')
    pdf.set_font("Arial", size=12)
    
    if not df.empty:
        total_income = df[df['Type'] == 'Income']['Amount'].sum()
        total_expense = df[df['Type'] == 'Expense']['Amount'].sum()
        
        pdf.cell(200, 10, txt=f"Total Income: ${total_income:,.2f}", ln=1, align='L')
        pdf.cell(200, 10, txt=f"Total Expenses: ${total_expense:,.2f}", ln=1, align='L')
        pdf.cell(200, 10, txt=f"Net Balance: ${(total_income - total_expense):,.2f}", ln=1, align='L')
        pdf.cell(200, 10, txt="", ln=1) # Spacer
        
        pdf.set_font("Arial", size=14, style='B')
        pdf.cell(200, 10, txt="Transaction History Overview:", ln=1, align='L')
        pdf.set_font("Arial", size=10)
        
        recent = df.sort_values(by="Date", ascending=False).head(30)
        for _, row in recent.iterrows():
            pdf.cell(200, 8, txt=f"{row['Date'].strftime('%Y-%m-%d')}   |   {row['Category'][:15]:15}   |   {row['Type'][:7]:7}   |   ${row['Amount']:,.2f}", ln=1, align='L')
            
    save_user = "".join([c for c in (user or "default") if c.isalnum() or c in ('_', '-')])
    pdf_path = f"data/FinSight_Report_{save_user}.pdf"
    pdf.output(pdf_path)
    return FileResponse(pdf_path, media_type="application/pdf", filename="FinSight_Report.pdf")

# ---- Serve React Frontend ----
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import HTTPException

base_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dist = os.path.join(base_dir, "..", "frontend", "dist")

# Only mount assets if they exist (prevents startup errors if not built yet)
assets_path = os.path.join(frontend_dist, "assets")
if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API route not found")
    
    target_path = os.path.join(frontend_dist, full_path)
    if os.path.exists(target_path) and os.path.isfile(target_path):
        return FileResponse(target_path)
    
    index_path = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {"message": "Frontend not built. Please run 'npm run build' in the frontend directory."}

