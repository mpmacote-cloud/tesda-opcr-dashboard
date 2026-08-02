import React from "react";
import KPISummaryCards from "./KPISummaryCards";
import OverallPerformanceGauge from "./OverallPerformanceGauge";

function DashboardOverview({
  totalKPIs,
  completedKPIs,
  ongoingKPIs,
  delayedKPIs,
  overallRating,
  SummaryCard
}) {
  return (
    <>
      <KPISummaryCards
        totalKPIs={totalKPIs}
        completedKPIs={completedKPIs}
        ongoingKPIs={ongoingKPIs}
        delayedKPIs={delayedKPIs}
        SummaryCard={SummaryCard}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 35
        }}
      >
        <OverallPerformanceGauge
          value={overallRating}
        />
      </div>
    </>
  );
}

export default DashboardOverview;