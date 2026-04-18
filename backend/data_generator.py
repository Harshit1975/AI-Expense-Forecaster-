import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import os

def generate_synthetic_data(filepath="data/expenses.csv"):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    if os.path.exists(filepath):
        return  # Do not overwrite if it exists

    print("Initializing empty financial dataset for real-time simulation...")
    
    # Create empty dataframe with required columns
    df = pd.DataFrame(columns=['Date', 'Category', 'Description', 'Amount', 'Type'])
    df.to_csv(filepath, index=False)
    print(f"Empty dataset initialized at {filepath}")

if __name__ == "__main__":
    # If explicitly run, wipe and generate empty
    df = pd.DataFrame(columns=['Date', 'Category', 'Description', 'Amount', 'Type'])
    df.to_csv("data/expenses.csv", index=False)
    print("Database wiped and reset for manual simulation!")

