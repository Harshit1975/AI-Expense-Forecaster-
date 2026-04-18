# AI-Expense-Forecaster

<p align="center">
  <img src="assets/logo.png" alt="AI-Expense-Forecaster Logo" width="300" />
</p>

![AI-Expense-Forecaster Banner](https://img.shields.io/badge/AI--Expense--Forecaster-Premium%20Analytics-8b5cf6?style=for-the-badge)  
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white) ![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white) 

## 📝 Overview
**AI-Expense-Forecaster** is an industry-grade, FinTech-inspired Full Stack Expense Tracking dashboard heavily integrated with Data Science methodologies. Unlike basic CRUD applications, **AI-Expense-Forecaster** leverages a high-performance **Python (FastAPI + Pandas + Scikit-Learn)** backend to clean, aggregate, analyze, and forecast financial data. The processed data is served to a dynamically animated, premium **React** frontend for interactive data visualization.

### Real-world Use Cases:
- **Personal Finance Tracking**: Helping individuals manage budgets, forecast zero-balance dates, and avoid living paycheck to paycheck.
- **Business Expense Monitoring**: Tracking company costs and detecting anomalous expenditures.
- **Financial Planning & Goal Setting**: Setting rigid limits for different categories utilizing active savings transaction-blockers.

---

## 🌟 Key Features

* **🤖 Predictive Analytics (Machine Learning)**  
  Integrates `scikit-learn` Linear Regression modeling to seamlessly analyze a user's spending velocity over time and forecast the exact day their funds will deplete, displayed elegantly on the AI Forecaster Dashboard card.

* **📄 Professional Automated Reporting**  
  Enterprise-grade document generation allowing users to effortlessly export their entire transaction history into beautifully formatted **PDF Financial Statements** (via FPDF) and CSV documents straight to their desktop with a simple click.

* **🎯 Gamified Goal Tracking System**  
  A visual interactive savings goal progress bar featuring transaction-blocking logic that proactively warns users and rejects expenses if the transaction would cause their projected balance to dip below their configured savings target.

* **📊 Complete Data Engineering Pipeline**  
  A robust backend structure utilizing **Pandas** for rigorous data wrangling, type sanitization, feature engineering, and robust metric aggregation—handling high volumes of simulated transactions without sacrificing speed.

* **💻 Premium Interactive UI Design**  
  A stunning, responsive React web interface employing glassmorphism, Recharts (Donut, Line, and Bar charts), automated skeletons, robust transaction data grids, dynamic search & filtering, and fluid state management.

* **⚙️ Real-time Data Simulation Engine**  
  Built-in synthetic dataset generator that can instantly inject customizable arrays of mock transactions to easily test UI behavior, modeling robustness, and component visualizations on command.

---

## 🏗️ Architecture & Tech Stack

### Backend
- **Core:** Python
- **API Framework:** FastAPI
- **Data Engineering:** Pandas, NumPy
- **Machine Learning:** Scikit-Learn (Linear Regression Time-Series Forecasting)
- **Reporting:** FPDF (PDF Generation)
- **Deployment:** Uvicorn unified HTTP serving

### Frontend
- **Framework:** React / Vite
- **Styling:** Advanced Vanilla CSS (Glassmorphism, CSS Variables, Animations)
- **Charting Engine:** Recharts
- **Iconography:** Lucide-React

### 🧠 Data Workflow Pipeline
`Data Input (React Form/Synthetic Iterators)` → `Storage (CSV/Database)` → `Processing (Pandas ETL)` → `Analysis (Aggregation/ML Forecasting)` → `API Output (JSON/PDF)` → `Visualization (React Charts)` → `Insights (Decision-making)`

### 🕸️ System Architecture Diagram
```text
[ React Frontend (UI & Charts) ]
             | (HTTP GET/POST Requests over REST API)
             v
[ Python FastAPI Backend (Controller) ]
             |
             v
[ Pandas & ML Data Engine (Cleaning, Aggr, Scikit-Learn) ]
             |
             v
[ Storage: backend/data/expenses.csv ]
```

---

## 🚀 How to Run Locally

We have created an automated deployment script `start_app.py` that handles compiling the modern React frontend and initializing the FastAPI backend all from a single terminal.

### 1. Prerequisites
Ensure you have Python 3.10+ and Node.js v16+ installed on your system.

### 2. Setup the Environment
In the root directory, activate your virtual environment and install the required dependencies (if you haven't already):
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # For Windows
# source venv/bin/activate # For Mac/Linux

pip install -r requirements.txt
cd ..
cd frontend
npm install
cd ..
```

### 3. Launch the App
Return to the Root folder and run the unified startup script:
```bash
python start_app.py
```

The script will automatically trigger `npm run build` on your frontend and mount the resulting single-page app tightly onto your FastAPI backend.

**The Application will be automatically available at:**  
[http://127.0.0.1:8000](http://127.0.0.1:8000)

### 🛠️ Troubleshooting
- **Port 8000 is busy**: Kill the terminal process running the server, or run FastAPI on a different port: `python -m uvicorn app:app --port 8001`.
- **CORS Error**: If React cannot fetch from Python, ensure FastAPI's `CORSMiddleware` in `app.py` is configured to allow your host URL.
- **ModuleNotFoundError: No module named 'pandas'**: Make sure your python virtual environment securely activated before installing requirements.

---

## 📈 Real-world Data Science Applications
- **Exploratory Data Analysis:** Clean tracking of total expenses vs income margins.
- **Predictive Modeling:** Calculates daily depletion averages utilizing linear curve fitting logic.
- **Reporting Pipelines:** Seamless integration connecting dataframes directly to raw HTTP response streams for robust data delivery.
