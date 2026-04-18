# FinSight: Analytics & Expense Tracker

<p align="center">
  <img src="assets/logo.png" alt="FinSight Logo" width="300" />
</p>

![FinSight Banner](https://img.shields.io/badge/FinSight-Premium%20Analytics-8b5cf6?style=for-the-badge)  
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white) ![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white) 

## 📝 Overview
**FinSight** is an industry-grade, FinTech-inspired Full Stack Expense Tracking dashboard heavily integrated with Data Science methodologies. Unlike basic CRUD applications, FinSight leverages a high-performance **Python (FastAPI + Pandas + Scikit-Learn)** backend to clean, aggregate, analyze, and forecast financial data. The processed data is served to a dynamically animated, premium **React** frontend for interactive data visualization.

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

---

## 📈 Real-world Data Science Applications
- **Exploratory Data Analysis:** Clean tracking of total expenses vs income margins.
- **Predictive Modeling:** Calculates daily depletion averages utilizing linear curve fitting logic.
- **Reporting Pipelines:** Seamless integration connecting dataframes directly to raw HTTP response streams for robust data delivery.

---

## 📂 Project Directory Structure
```text
FinSight/
├── assets/                    # Project logos and generated graphics
├── backend/                   # Python FastAPI Server
│   ├── data/                  # Synthetically generated CSV files & PDF exports
│   ├── app.py                 # Core API routing and ML endpoint definitions
│   ├── data_generator.py      # Script to mock thousands of realistic transctions
│   └── data_processor.py      # Pandas data cleaning and metric aggregation
├── frontend/                  # React + Vite Client
│   ├── public/                # Static assets
│   └── src/
│       ├── App.jsx            # Main React Dashboard and UI components
│       ├── App.css            # Component-level styling
│       └── index.css          # Global Design System (Tokens, Glassmorphism)
└── start_app.py               # Unified initialization script
```

---

## 📡 API Endpoints Documentation
FinSight utilizes a RESTful API architecture connecting the Data Science backend to the React interface.
- `GET /api/dashboard` : Returns rigorously aggregated KPI metrics (Total Income, Expenses, Balance), Category Breakdowns, and Monthly Trends using Pandas.
- `GET /api/transactions` : Supplies the raw transaction history data formatted efficiently for the frontend Data Grid.
- `POST /api/transaction` : Securely ingests new transaction records and immediately recalculates your net balance metrics against your Goal threshold.
- `POST /api/simulate` : Development testing route designed to inject customizable arrays of synthetic transaction data to instantly populate charts.
- `GET /api/predict` : Utilizes `scikit-learn` Linear Regression processing daily spending to confidently forecast your wealth depletion date.
- `GET /api/export/pdf` : Automatically compiles and formats raw transaction variables utilizing Python FPDF into a downloadable FinSight Financial Statement.
- `GET /api/export/csv` : Directly exports the current `Pandas` dataframe to an Excel-friendly CSV.

---

## 🔭 Future Scope & Roadmap
- **Advanced Machine Learning Models:** Upgrading from Linear Regression to ARIMA or LSTMs for complex, cyclical predictive spending behavior.
- **SQL Database Integration:** Migrating from physical `.csv` persistence logic to enterprise-grade robust PostgreSQL mapping.
- **Authentication:** Implementing secure JWT tokens and encrypted password management per user account.
