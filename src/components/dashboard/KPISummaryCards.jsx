function KPISummaryCards({
  totalKPIs,
  completedKPIs,
  ongoingKPIs,
  delayedKPIs,
  SummaryCard
}) {
  return (
    <>
      <h3
        style={{
          marginBottom: 12,
          marginTop: 10,
          color: "#0038A8",
          fontWeight: "bold",
          borderLeft: "5px solid #0038A8",
          paddingLeft: 10
        }}
      >
        Summary Cards
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20
        }}
      >
        <SummaryCard
          title="Total KPIs"
          value={totalKPIs}
          color="#1976d2"
        />

        <SummaryCard
          title="Completed"
          value={completedKPIs}
          color="#4caf50"
        />

        <SummaryCard
          title="Ongoing"
          value={ongoingKPIs}
          color="#ff9800"
        />

        <SummaryCard
          title="Delayed"
          value={delayedKPIs}
          color="#f44336"
        />
      </div>
    </>
  );
}

export default KPISummaryCards;