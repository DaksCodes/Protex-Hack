import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

const COLORS = [
  "#4f46e5", // indigo
  "#22c55e", // green
  "#f59e0b", // yellow
  "#ef4444", // red
  "#3b82f6", // blue
  "#a855f7", // purple
  "#14b8a6", // teal
];

export default function ExpensePie({ data }) {
  const formatted = Object.keys(data).map((key) => ({
    name: key,
    value: data[key],
  }));

  return (
    <PieChart width={350} height={300}>
      <Pie
        data={formatted}
        dataKey="value"
        outerRadius={100}
        label
      >
        {formatted.map((entry, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  );
}