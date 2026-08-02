import React from "react";
import {
  BarChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

function YearlyPerformanceChart({
  yearlyPerformanceData,
  ChartBox
}) {
  return (
    <ChartBox
      title="🔒 Yearly Performance Rating (%)"
      annotation="📌 Based on all records (not affected by filters)"
    >
      <div
        style={{
          fontSize: 12,
          color: "#666",
          marginBottom: 8
        }}
      />

      <BarChart data={yearlyPerformanceData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="year" />

        <YAxis
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />

        <Tooltip formatter={(v) => `${v}%`} />

        <Bar
          dataKey="rating"
          fill="#03a9f4"
        />

        <Line
          type="monotone"
          dataKey="rating"
          stroke="#ff5722"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </BarChart>
    </ChartBox>
  );
}

export default YearlyPerformanceChart;