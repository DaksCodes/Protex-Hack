import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function BudgetChart({ actual, budget }) {
  const data = Object.keys(actual).map((key) => ({
    category: key,
    actual: actual[key],
    budget: budget[key] || 0,
  }));

  return (
    <BarChart width={500} height={300} data={data}>
      <XAxis dataKey="category" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="actual" />
      <Bar dataKey="budget" />
    </BarChart>
  );
}