from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from pymongo import MongoClient
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- DATABASE SETUP --------
MONGO_URI = "mongodb+srv://sy0381718_db_user:JBcn424qYwSW9i0k@cluster0.vjpjfyo.mongodb.net/?appName=Cluster0"  
client = MongoClient(MONGO_URI)
db = client["finance_db"] 
transactions_collection = db["expenses"]


def load_data():
    data = list(transactions_collection.find({}, {"_id": 0}))
    df = pd.DataFrame(data)
    
    if not df.empty:
        if "date" in df.columns:
            df["date"] = pd.to_datetime(df["date"], errors="coerce")
        if "amount" in df.columns:
            df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
            
    return df


@app.get("/api/expenses")
def get_expenses():
    df = load_data()
    if df.empty:
        return []
    
    df = df.replace({np.nan: None})
    if "date" in df.columns:
        df["date"] = df["date"].astype(str)
        
    return df.to_dict(orient="records")

@app.get("/api/summary")
def get_summary():
    df = load_data()
    
    if df.empty:
        return {"total": 0, "category": {}, "monthly": {}}

    total = float(df["amount"].sum())
    
    # Category summary
    if "category" in df.columns:
        category = df.groupby("category")["amount"].sum().to_dict()
    else:
        category = {}

    # Monthly summary
    if "date" in df.columns:
        monthly = df.groupby(df["date"].dt.to_period("M"))["amount"].sum()
        monthly.index = monthly.index.astype(str)
        monthly_dict = monthly.to_dict()
    else:
        monthly_dict = {}

    return {
        "total": total,
        "category": category,
        "monthly": monthly_dict
    }


@app.get("/api/ml/fire-inputs")
def get_fire_predictions():
    df_db = load_data()
    
    if df_db.empty:
        return {
            "predicted_monthly_expense": 0,
            "predicted_yearly_savings": 0,
            "message": "Database is empty. Add some transactions first."
        }
    
    if 'category' not in df_db.columns or 'amount' not in df_db.columns:
        return {"error": "Category or amount column missing in database!"}
        
    df_db['category'] = df_db['category'].str.lower()
    
    incomes_df = df_db[df_db['category'] == 'income']
    expenses_df = df_db[df_db['category'] != 'income']
    
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
    
    if len(monthly_expenses) > 1:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
        eval_model = LinearRegression()
        eval_model.fit(X_train, y_train)
        test_predictions = eval_model.predict(X_test)
        mae_error = mean_absolute_error(y_test, test_predictions)
    else:
        mae_error = 0
    
    final_model = LinearRegression()
    final_model.fit(X, y) 
    
    next_month_idx = [[len(monthly_expenses)]]
    predicted_monthly_expense = final_model.predict(next_month_idx)[0]
    
    monthly_incomes = incomes_df.resample('ME', on='date')['amount'].sum().reset_index()
    avg_monthly_income = monthly_incomes['amount'].mean() if not monthly_incomes.empty else 0
    avg_monthly_expense = monthly_expenses['amount'].mean()
    
    predicted_yearly_savings = max(0, (avg_monthly_income - avg_monthly_expense) * 12)

    return {
        "predicted_monthly_expense": round(predicted_monthly_expense, 2),
        "predicted_yearly_savings": round(predicted_yearly_savings, 2)
    }



class ChatRequest(BaseModel):
    message: str

months_map = {"january":1, "february":2, "march":3, "april":4, "may":5, "june":6, "july":7, "august":8, "september":9, "october":10, "november":11, "december":12}

def get_advice(category, data, total_income):
    if category == "investment":
        inv_data = data[data['category'] == 'investment'] if 'investment' in data['category'].values else pd.DataFrame()
        total_inv = inv_data['amount'].sum() if not inv_data.empty else 0
        return f"📈 **Investment Tips:**\n• Total invested: ₹{total_inv:,.0f}\n• 💡 Continue SIPs! Good diversification in Mutual Funds/Stocks."
    
    elif "budget" in category.lower():
        top_cats = data[data['category'] != 'income'].groupby('category')['amount'].sum().nlargest(3)
        advice = "💳 **Budget Advice:**\n• Top spends:\n" + '\n'.join([f"  - {cat.title()}: ₹{amt:,.0f}" for cat,amt in top_cats.items()])
        total_spent = data[data['category'] != 'income']['amount'].sum()
        savings_rate = ((total_income - total_spent) / total_income * 100) if total_income > 0 else 0
        advice += f"\n• 💡 Savings rate: {savings_rate:.1f}% - Try to reduce top category by 10%!"
        return advice
    
    elif "saving" in category.lower() or "emergency" in category.lower():
        total_spent = data[data['category'] != 'income']['amount'].sum()
        return f"🏦 **Savings Plan:**\n• 💡 Emergency fund goal: 6 months expenses (₹{total_spent*6:,.0f})\n• 📊 Try to save at least 20% of your income!"
    
    else:
        total_spend = data['amount'].sum()
        return f"💰 **{str(category).title()} Summary:** ₹{total_spend:,.0f} spent\n💡 Review recent transactions & cut non-essentials."

@app.post("/api/ml/chat")
def chat_endpoint(request: ChatRequest):
    df = load_data()
    if df.empty:
        return {"response": "⚠️ Database is empty. Please add some transactions first!"}
        
    df['category'] = df['category'].astype(str).str.lower()
    user_input = request.message.lower().strip()
    data = df.copy()
    
    # Extract month
    month = next((months_map[m] for m in months_map if m in user_input), None)
    
    # Extract category
    unique_cats = df['category'].dropna().unique()
    category = next((cat for cat in unique_cats if cat in user_input), None)
    
    if month and 'date' in df.columns:
        data = data[data['date'].dt.month == month]
    
    category_data = data[data['category'] == category] if category else data
    
    if data.empty:
        return {"response": "⚠️ No matching data found for your query."}
    
    total_income = df[df['category'] == 'income']['amount'].sum()
    
    # Smart Logic
    if any(word in user_input for word in ["total", "spend", "sum", "kharcha"]):
        result = f"💰 **Total:** ₹{category_data['amount'].sum():,.0f}"
    elif "average" in user_input or "avg" in user_input:
        result = f"📊 **Average:** ₹{category_data['amount'].mean():,.0f}"
    elif "highest" in user_input or "max" in user_input:
        if not category_data.empty:
            row = category_data.loc[category_data['amount'].idxmax()]
            result = f"📌 **Highest:** ₹{row['amount']:.0f} - {row.get('description', 'N/A')}"
        else:
            result = "No data for highest amount."
    elif any(word in user_input for word in ["tip", "advice", "plan", "budget", "saving", "investment"]):
        result = get_advice(category or user_input, data, total_income)
    else:
        cats = data[data['category'] != 'income'].groupby('category')['amount'].sum().sort_values(ascending=False)
        result = f"📋 **Quick Expense Summary:**\n" + '\n'.join([f"• {cat.title()}: ₹{amt:,.0f}" for cat,amt in cats.head().items()])
    
    return {"response": result}