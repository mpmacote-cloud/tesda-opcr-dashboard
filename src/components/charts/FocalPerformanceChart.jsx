import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";

function FocalPerformanceChart({
  focalPerformanceData,
  getRatingColor,
  ChartBox,
  LegendItem
}) {
  return (
    <div style={{ flex: 1, minWidth: 300 }}>
      <ChartBox title="Focal Person Performance Rating (%)">
        <BarChart data={focalPerformanceData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />

          <Tooltip formatter={(v) => `${v}%`} />

          <Bar dataKey="rating">
            {focalPerformanceData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getRatingColor(entry.rating)}
              />
            ))}
          </Bar>
        </BarChart>

        <div
          style={{
            display: "flex",
            gap: 15,
            marginTop: 10,
            fontSize: 12
          }}
        >
          <LegendItem
            color="#f44336"
            label="0–50% (Needs Improvement)"
          />
          <LegendItem
            color="#ffc107"
            label="51–74% (Satisfactory)"
          />
          <LegendItem
            color="#4caf50"
            label="75–100% (Outstanding)"
          />
        </div>
      </ChartBox>
    </div>
  );
}

export default FocalPerformanceChart;