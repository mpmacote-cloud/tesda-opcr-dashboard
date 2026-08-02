import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

function OverallAccomplishmentPieChart({
  yearlyOverallData,
  PIE_COLORS,
  ChartBox
}) {
  return (
    <div style={{ flex: 1, minWidth: 300 }}>
      <ChartBox
        title="Yearly Overall Accomplishment (%)"
        annotation="📌 Based on Filtered records"
      >
        <PieChart width={300} height={300}>
          <Pie
            data={yearlyOverallData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ value }) => `${value}%`}
          >
            {yearlyOverallData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
        </PieChart>
      </ChartBox>
    </div>
  );
}

export default OverallAccomplishmentPieChart;