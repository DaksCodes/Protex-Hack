from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from pymongo import MongoClient

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = "mongodb+srv://sy0381718_db_user:JBcn424qYwSW9i0k@cluster0.vjpjfyo.mongodb.net/?appName=Cluster0"  
client = MongoClient(MONGO_URI)
db = client["finance_db"] 
transactions_collection = db["expenses"]

@app.get("/api/ml/fire-inputs")
def get_fire_predictions():
    
    
    user_transactions = list(transactions_collection.find({}, {"_id": 0}))
    
    if not user_transactions:
        return {
            "predicted_monthly_expense": 0,
            "predicted_yearly_savings": 0,
            "message": "Database is empty. Add some transactions first."
        }

    
    df = pd.DataFrame(user_transactions)
    df['date'] = pd.to_datetime(df['date'])
    
    
    if 'category' not in df.columns:
        return {"error": "Category column missing in database!"}
        
    df['category'] = df['category'].str.lower()
    
   
    
    #Income
    incomes_df = df[df['category'] == 'income']
    
    #Expenses
    expenses_df = df[df['category'] != 'income']
    
    
    if expenses_df.empty:
        return {
            "predicted_monthly_expense": 0,
            "predicted_yearly_savings": 0,
            "message": "Not enough expense data to run ML."
        }

   
    monthly_expenses = expenses_df.resample('ME', on='date')['amount'].sum().reset_index()
    monthly_expenses['MonthIndex'] = np.arange(len(monthly_expenses))

    X = monthly_expenses[['MonthIndex']]
    y = monthly_expenses['amount']
    
    # Train-Test Split
    if len(monthly_expenses) > 1:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
        eval_model = LinearRegression()
        eval_model.fit(X_train, y_train)
        test_predictions = eval_model.predict(X_test)
        mae_error = mean_absolute_error(y_test, test_predictions)
    else:
        mae_error = 0
    
    #Future prediction
    final_model = LinearRegression()
    final_model.fit(X, y) 
    
    next_month_idx = [[len(monthly_expenses)]]
    predicted_monthly_expense = final_model.predict(next_month_idx)[0]
    
    #Saving yearly calculation
    monthly_incomes = incomes_df.resample('ME', on='date')['amount'].sum().reset_index()
    
    avg_monthly_income = monthly_incomes['amount'].mean() if not monthly_incomes.empty else 0
    avg_monthly_expense = monthly_expenses['amount'].mean()
    
    predicted_yearly_savings = max(0, (avg_monthly_income - avg_monthly_expense) * 12)

    return {
        "predicted_monthly_expense": round(predicted_monthly_expense, 2),
        "predicted_yearly_savings": round(predicted_yearly_savings, 2)
    }