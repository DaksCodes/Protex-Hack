from pymongo import MongoClient
from dotenv import load_dotenv
import os
import pandas as pd

# Load .env
load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})   # ✅ THIS LINE

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

db = client["finance_db"]
collection = db["expenses"]

# ------------------ Load Data ------------------
def load_data():
    data = list(collection.find({}, {"_id": 0}))
    df = pd.DataFrame(data)

    if not df.empty:
        df["date"] = pd.to_datetime(df["date"])

    return df

# ------------------ Get All Expenses ------------------
@app.route("/expenses", methods=["GET"])
def get_expenses():
    df = load_data()

    if df.empty:
        return jsonify([])

    return jsonify(df.to_dict(orient="records"))

# ------------------ Summary ------------------
@app.route("/summary", methods=["GET"])
def get_summary():
    df = load_data()

    if df.empty:
        return jsonify({
            "total": 0,
            "category": {},
            "monthly": {}
        })

    total = df["amount"].sum()

    category = df.groupby("category")["amount"].sum().to_dict()

    monthly = df.groupby(df["date"].dt.to_period("M"))["amount"].sum()
    monthly.index = monthly.index.astype(str)

    return jsonify({
        "total": float(total),
        "category": category,
        "monthly": monthly.to_dict()
    })

# ------------------ Run ------------------
if __name__ == "__main__":
    app.run(debug=True)