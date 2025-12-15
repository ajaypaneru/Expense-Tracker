import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomBarChart = ({ data }) => {
  const getBarColor = (index) => {
    return index % 2 === 0 ? "#875cf5" : "#cfbefb";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 mb-1">
            {item.category || item.source || item.month}
          </p>
          <p className="text-sm text-gray-600">
            Amount:{" "}
            <span className="text-sm font-medium text-gray-900">
              Rs.{item.amount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Pick whichever label exists (month, category, or source)
  const xKey =
    data.length > 0
      ? Object.keys(data[0]).find((k) =>
          ["month", "category", "source"].includes(k)
        )
      : "month";

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid stroke="none" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 10, fill: "#555" }}
          stroke="none"
        />
        <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={getBarColor(index)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
