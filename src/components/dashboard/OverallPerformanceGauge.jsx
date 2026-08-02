import React from "react";
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function OverallPerformanceGauge({ value }) {
  const color =
    value >= 75
      ? "#4caf50"
      : value >= 50
      ? "#ff9800"
      : "#f44336";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 20,
        width: "100%",
        maxWidth: 360,
        margin: "0 auto",
        boxShadow: "0 8px 20px rgba(0,0,0,.10)",
        textAlign: "center"
      }}
    >
      <h3
        style={{
          color: "#0038A8",
          marginBottom: 10
        }}
      >
        Overall Performance Rating
      </h3>

      <div
        style={{
          width: 220,
          height: 220,
          margin: "auto"
        }}
      >
        <CircularProgressbar
          value={value}
          text={`${value.toFixed(1)}%`}
          styles={buildStyles({
            pathColor: color,
            textColor: color,
            trailColor: "#eeeeee",
            textSize: "16px"
          })}
        />
      </div>

      <h2
        style={{
          marginTop: 10,
          color
        }}
      >
        {value >= 75
          ? "Excellent"
          : value >= 50
          ? "Needs Attention"
          : "Critical"}
      </h2>

      <p
        style={{
          marginTop: 15,
          color: "#666",
          fontSize: 14
        }}
      >
        Overall accomplishment across all KPIs
      </p>
    </div>
  );
}

export default OverallPerformanceGauge;