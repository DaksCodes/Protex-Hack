import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ExpenseLine({ data }) {
  const formatted = Object.keys(data).map((key) => ({
    month: key,
    amount: data[key],
  }));

  return (
    <LineChart width={450} height={300} data={formatted}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />

      <Line
        type="monotone"
        dataKey="amount"
        stroke="#4f46e5"
        strokeWidth={3}
        dot={{ r: 4 }}
      />
    </LineChart>
  );
}