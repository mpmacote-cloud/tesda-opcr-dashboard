import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell
} from "recharts";

function OperatingUnitPerformanceChart({
  operatingUnitPerformanceData,
  getRatingColor,
  ChartBox,
  LegendItem
}) {
  return (
    <>
     {/* <h3
        style={{
          marginTop: 25,
          marginBottom: 10,
          color: "#E30613",
          fontWeight: "bold"
        }}
      > 
        Performance by Operating Unit (%)
      </h3>
      */}
      <ChartBox title="Performance by Operating Unit (%)">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={operatingUnitPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="unit"
              angle={-20}
              textAnchor="end"
              height={50}
              tick={{
                fontSize: 10,
                fontWeight: 500
              }}
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip
              formatter={(v) => `${v}%`}
            />

            <Bar dataKey="rating">
              {operatingUnitPerformanceData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={getRatingColor(entry.rating)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

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
            label="0–50% Needs Improvement"
          />

          <LegendItem
            color="#ffc107"
            label="51–74% Satisfactory"
          />

          <LegendItem
            color="#4caf50"
            label="75–100% Outstanding"
          />
        </div>
      </ChartBox>
    </>
  );
}

export default OperatingUnitPerformanceChart;