import { useEffect, useState } from "react";
import { fetchSummary } from "../utils/api";
import ExpensePie from "../components/charts/PieChart";
import ExpenseLine from "../components/charts/LineChart";
import ExpenseBar from "../components/charts/BarChart";
import BudgetChart from "../components/charts/BudgetChart";
import Header from "../components/Header";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [budgets, setBudgets] = useState({});

  useEffect(() => {
    fetchSummary()
      .then(setData)
      .catch(() => console.error("API failed"));

    // Load saved budgets
    const savedBudgets = JSON.parse(localStorage.getItem("budgets"));
    if (savedBudgets) {
      setBudgets(savedBudgets);
    }
  }, []);

  if (!data)
    return <h2 style={{ padding: "20px" }}>Loading dashboard...</h2>;

  // 🎯 Find top category
  const topCategory = Object.keys(data.category).reduce((a, b) =>
    data.category[a] > data.category[b] ? a : b
  );

  // 🎨 STYLES
  const container = {
    padding: "30px",
    background: "#f4f6f9",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  };

  const title = {
    marginBottom: "20px",
  };

  const cardRow = {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
  };

  const card = {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    flex: 1,
    minWidth: "300px",
  };

  const label = {
    color: "#777",
  };

  const value = {
    color: "#111",
  };

  const budgetGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    marginTop: "10px",
  };

  const inputBox = {
    display: "flex",
    flexDirection: "column",
  };

  const input = {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  };

  const button = {
    marginTop: "15px",
    padding: "10px 20px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  };

  const insightCard = {
    marginTop: "20px",
    background: "#eef2ff",
    padding: "20px",
    borderRadius: "16px",
  };

  const warning = {
    color: "#dc2626",
    fontWeight: "bold",
  };

  return (
    <div style={container}>
      <Header />
      <h1 style={title}>📊 Financial Dashboard</h1>

      {/* TOP CARDS */}
      <div style={cardRow}>
        <div style={card}>
          <p style={label}>Total Spending</p>
          <h2 style={value}>₹ {data.total}</h2>
        </div>

        <div style={card}>
          <p style={label}>Top Category</p>
          <h2 style={value}>{topCategory}</h2>
        </div>
      </div>

      {/* 💰 BUDGET SECTION */}
      <div style={card}>
        <h3>Set Monthly Budget</h3>

        <div style={budgetGrid}>
          {Object.keys(data.category).map((cat) => (
            <div key={cat} style={inputBox}>
              <label>{cat}</label>
              <input
                type="number"
                value={budgets[cat] || ""}
                onChange={(e) =>
                  setBudgets({
                    ...budgets,
                    [cat]: Number(e.target.value),
                  })
                }
                style={input}
              />
            </div>
          ))}
        </div>

        <button
          style={button}
          onClick={() => {
            localStorage.setItem("budgets", JSON.stringify(budgets));
            alert("Budget Saved!");
          }}
        >
          Save Budget
        </button>
      </div>

      {/* 📈 CHARTS */}
      <div style={cardRow}>
        <div style={card}>
          <h3>Monthly Trend</h3>
          <ExpenseLine data={data.monthly} />
        </div>

        <div style={card}>
          <h3>Category Distribution</h3>
          <ExpensePie data={data.category} />
        </div>
      </div>

      {/* 📊 CATEGORY COMPARISON */}
      <div style={card}>
        <h3>Category Comparison</h3>
        <ExpenseBar data={data.category} />
      </div>

      {/* 💸 BUDGET VS ACTUAL */}
      <div style={card}>
        <h3>Budget vs Actual</h3>
        <BudgetChart actual={data.category} budget={budgets} />
      </div>

      {/* ✨ INSIGHTS */}
      <div style={insightCard}>
        <h3>💡 Insights</h3>

        <p>
          You are spending the most on <b>{topCategory}</b>.
        </p>

        {Object.keys(data.category).map((cat) => {
          if (budgets[cat] && data.category[cat] > budgets[cat]) {
            return (
              <p key={cat} style={warning}>
                ⚠️ {cat}: Exceeded budget!
              </p>
            );
          }
        })}
      </div>
    </div>
  );
}