from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/ml/fire-inputs")
def get_fire_predictions():
    #data
    df = pd.read_csv('Personal_Finance_Dataset.csv')
    df['Date'] = pd.to_datetime(df['Date'])
    
    #expense calc
    expenses_df = df[df['Type'] == 'Expense']
    monthly_expenses = expenses_df.resample('ME', on='Date')['Amount'].sum().reset_index()
    monthly_expenses['MonthIndex'] = np.arange(len(monthly_expenses))

    #train test
    X = monthly_expenses[['MonthIndex']]
    y = monthly_expenses['Amount']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    #evalutaion
    eval_model = LinearRegression()
    eval_model.fit(X_train, y_train)
    
    #test
    test_predictions = eval_model.predict(X_test)
    mae_error = mean_absolute_error(y_test, test_predictions)
    
    #future 
    final_model = LinearRegression()
    final_model.fit(X, y) 
    
    #prediction
    next_month_idx = [[len(monthly_expenses)]]
    predicted_monthly_expense = final_model.predict(next_month_idx)[0]
    
    #saving yrly
    incomes_df = df[df['Type'] == 'Income']
    monthly_incomes = incomes_df.resample('ME', on='Date')['Amount'].sum().reset_index()
    
    avg_monthly_income = monthly_incomes['Amount'].mean()
    avg_monthly_expense = monthly_expenses['Amount'].mean()
    predicted_yearly_savings = max(0, (avg_monthly_income - avg_monthly_expense) * 12)

    #JSON to React
    return {
        "predicted_monthly_expense": round(predicted_monthly_expense, 2),
        "predicted_yearly_savings": round(predicted_yearly_savings, 2)
    }