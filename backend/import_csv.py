from pymongo import MongoClient
from dotenv import load_dotenv
import pandas as pd
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["finance_db"]
collection = db["expenses"]

# Load CSV
df = pd.read_csv("expenses_dataset.csv")

# Convert to dict
data = df.to_dict(orient="records")

# Insert into MongoDB
collection.insert_many(data)

print("✅ CSV data imported into MongoDB!")