import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

function KPIPerformanceChart({
  chartData,
  ChartBox
}) {
  return (
    <>
      <h3
        style={{
          marginTop: 25,
          marginBottom: 10,
          color: "#E30613",
          fontWeight: "bold"
        }}
      >
        KPI Performance
      </h3>

      <ChartBox title="Target vs Accomplishment by KPI">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              angle={-20}
              textAnchor="end"
              height={60}
              tick={{
                fontSize: 10
              }}
            />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="Target"
              fill="#0038A8"
            />

            <Bar
              dataKey="Accomplishment"
              fill="#E30613"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
    </>
  );
}

export default KPIPerformanceChart;