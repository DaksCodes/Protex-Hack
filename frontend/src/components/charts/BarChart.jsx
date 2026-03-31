import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ExpenseBar({ data }) {
  const formatted = Object.keys(data).map((key) => ({
    category: key,
    amount: data[key],
  }));

  return (
    <BarChart width={500} height={300} data={formatted}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="category" />
      <YAxis />
      <Tooltip />

      <Bar dataKey="amount" fill="#22c55e" radius={[6, 6, 0, 0]} />
    </BarChart>
  );
}