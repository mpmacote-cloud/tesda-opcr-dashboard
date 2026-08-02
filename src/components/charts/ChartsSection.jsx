import React from "react";

import KPIPerformanceChart from "./KPIPerformanceChart";
import PAPPerformanceChart from "./PAPPerformanceChart";
import YearlyPerformanceChart from "./YearlyPerformanceChart";

function ChartsSection({
  chartRef,
  kpiChartData,
  ChartBox,
  papPerformanceData,
  yearlyPerformanceData,
  getRatingColor,
  LegendItem
}) {
  return (
  <div
    ref={chartRef}
    style={{
      marginBottom: 50,
      display: "flex",
      flexDirection: "column",
      gap: 35
    }}
  >
    <KPIPerformanceChart
      chartData={kpiChartData}
      ChartBox={ChartBox}
    />

    <PAPPerformanceChart
      papPerformanceData={papPerformanceData}
      getRatingColor={getRatingColor}
      ChartBox={ChartBox}
      LegendItem={LegendItem}
    />

    <YearlyPerformanceChart
      yearlyPerformanceData={yearlyPerformanceData}
      ChartBox={ChartBox}
    />
  </div>
);
}

export default ChartsSection;