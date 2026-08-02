import React from "react";
import OverallAccomplishmentPieChart from "./OverallAccomplishmentPieChart";
import FocalPerformanceChart from "./FocalPerformanceChart";

function AnalyticsSection({
  yearlyOverallData,
  PIE_COLORS,
  focalPerformanceData,
  getRatingColor,
  ChartBox,
  LegendItem
}) {
  return (
    <>
      <h3
        style={{
          marginBottom: 12,
          marginTop: 60,
          color: "#0038A8",
          fontWeight: "bold",
          borderLeft: "5px solid #0038A8",
          paddingLeft: 10
        }}
      >
        Performance Analytics & Charts
      </h3>

      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 20
        }}
      >
        <OverallAccomplishmentPieChart
          yearlyOverallData={yearlyOverallData}
          PIE_COLORS={PIE_COLORS}
          ChartBox={ChartBox}
        />

        <FocalPerformanceChart
          focalPerformanceData={focalPerformanceData}
          getRatingColor={getRatingColor}
          ChartBox={ChartBox}
          LegendItem={LegendItem}
        />
      </div>
    </>
  );
}

export default AnalyticsSection;