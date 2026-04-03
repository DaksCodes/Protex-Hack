from google import genai
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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

# -------- DATABASE SETUP --------
MONGO_URI = "mongodb+srv://sy0381718_db_user:JBcn424qYwSW9i0k@cluster0.vjpjfyo.mongodb.net/?appName=Cluster0"
mongo_client = MongoClient(MONGO_URI)  # FIX: renamed to mongo_client to avoid conflict with genai client
db = mongo_client["finance_db"]
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

    if "category" in df.columns:
        df = df[df["category"].str.lower() != "income"]

    if df.empty:
        return {"total": 0, "category": {}, "monthly": {}}

    total = float(df["amount"].sum())

    if "category" in df.columns:
        category = df.groupby("category")["amount"].sum().to_dict()
    else:
        category = {}

    if "date" in df.columns:
        monthly = df.groupby(df["date"].dt.to_period("M"))["amount"].sum()
        monthly.index = monthly.index.astype(str)
        monthly_dict = monthly.to_dict()
    else:
        monthly_dict = {}

    return {
        "total": total,
        "category": category,
        "monthly": monthly_dict,
    }


@app.get("/api/ml/fire-inputs")
def get_fire_predictions():
    df_db = load_data()

    if df_db.empty:
        return {
            "predicted_monthly_expense": 0,
            "predicted_yearly_savings": 0,
            "message": "Database is empty. Add some transactions first.",
        }

    if "category" not in df_db.columns or "amount" not in df_db.columns:
        return {"error": "Category or amount column missing in database!"}

    df_db["category"] = df_db["category"].str.lower()

    incomes_df = df_db[df_db["category"] == "income"]
    expenses_df = df_db[df_db["category"] != "income"]

    if expenses_df.empty:
        return {
            "predicted_monthly_expense": 0,
            "predicted_yearly_savings": 0,
            "message": "Not enough expense data to run ML.",
        }

    monthly_expenses = (
        expenses_df.resample("ME", on="date")["amount"].sum().reset_index()
    )
    monthly_expenses["MonthIndex"] = np.arange(len(monthly_expenses))

    X = monthly_expenses[["MonthIndex"]]
    y = monthly_expenses["amount"]

    if len(monthly_expenses) > 1:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, shuffle=False
        )
        eval_model = LinearRegression()
        eval_model.fit(X_train, y_train)
        test_predictions = eval_model.predict(X_test)
        mae_error = mean_absolute_error(y_test, test_predictions)  # noqa: F841
    else:
        mae_error = 0  # noqa: F841

    final_model = LinearRegression()
    final_model.fit(X, y)

    next_month_idx = [[len(monthly_expenses)]]
    predicted_monthly_expense = final_model.predict(next_month_idx)[0]

    monthly_incomes = (
        incomes_df.resample("ME", on="date")["amount"].sum().reset_index()
    )
    avg_monthly_income = (
        monthly_incomes["amount"].mean() if not monthly_incomes.empty else 0
    )
    avg_monthly_expense = monthly_expenses["amount"].mean()

    predicted_yearly_savings = max(
        0, (avg_monthly_income - avg_monthly_expense) * 12
    )

    return {
        "predicted_monthly_expense": round(predicted_monthly_expense, 2),
        "predicted_yearly_savings": round(predicted_yearly_savings, 2),
    }


# -------- GEMINI SETUP --------

api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    raise ValueError("cant fetch gemini key")

gemini_client = genai.Client(api_key=api_key)

 
 
class ChatRequest(BaseModel):
    message: str
    budget: float = 50000.0  # Optional: frontend can pass user's set budget
 
 
@app.post("/api/ml/chat")
async def dynamic_chat(request: ChatRequest):
    df = load_data()
 
    # ---- Build financial context from DB ----
    has_data = not df.empty
 
    if has_data:
        df["category"] = df["category"].str.lower().str.strip()
        incomes_df = df[df["category"] == "income"]
        expenses_df = df[df["category"] != "income"]
 
        total_income = float(incomes_df["amount"].sum())
        total_spent = float(expenses_df["amount"].sum())
        cat_summary = expenses_df.groupby("category")["amount"].sum().round(2).to_dict()
 
        recent_txns = expenses_df.tail(5).copy()
        if "date" in recent_txns.columns:
            recent_txns["date"] = recent_txns["date"].astype(str)
        recent_txns_list = recent_txns[["date", "category", "amount"]].to_dict(orient="records") \
            if {"date", "category", "amount"}.issubset(recent_txns.columns) else []
 
        # Use budget from DB if available, else from request body
        if "budget" in df.columns and df["budget"].notna().any():
            user_budget = float(df["budget"].dropna().iloc[-1])
        else:
            user_budget = request.budget
 
        remaining_budget = round(user_budget - total_spent, 2)
 
        financial_context = f"""
USER'S FINANCIAL SNAPSHOT:
- Monthly Budget Set: ₹{user_budget:,.2f}
- Total Income Recorded: ₹{total_income:,.2f}
- Total Amount Spent: ₹{total_spent:,.2f}
- Remaining Budget: ₹{remaining_budget:,.2f}
- Spending by Category: {cat_summary}
- Last 5 Transactions: {recent_txns_list}
"""
    else:
        financial_context = "No financial data found in the database yet."
        user_budget = request.budget
        remaining_budget = user_budget
 
    # ---- System prompt ----
    system_prompt = f"""
You are a friendly, knowledgeable personal finance assistant. You reply in a conversational tone.
 
RULES:
1. If the user asks a GENERAL finance question (e.g., "what is SIP", "what is inflation", "how do mutual funds work", "what is compound interest", "investment tips"), give a clear, concise educational answer. Do NOT mention or reference the user's personal data in this case.
 
2. If the user asks about THEIR OWN finances (e.g., "how much did I spend", "what's my remaining budget", "where am I spending most", "can I afford X", "am I saving enough"), use the financial snapshot below to give a personalized, data-driven answer.
 
3. If the question is AMBIGUOUS (could be general or personal), default to answering using the user's data when relevant, and add a brief general explanation if helpful.
 
4. Never make up numbers. Only use values from the snapshot provided.
5. Keep responses concise (3–6 lines) unless the user asks for detail.
6. You may reply in Hinglish if the user writes in Hinglish.
 
{financial_context}
"""
 
    # ---- Call Gemini ----
    full_prompt = f"{system_prompt}\n\nUser: {request.message}"
 
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=full_prompt,
    )
 
    return {"response": response.text}
if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
