import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import React, { useState, useEffect, useRef } from "react";

import {
  BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell  // <-- add PieChart, Pie, Cell here
} from "recharts";


import jsPDF from "jspdf";
import html2canvas from "html2canvas";


function OPCRDashboard({ role, activeTab, setActiveTab }) {
  const chartRef = useRef(null);
  const kpiInputRef = useRef(null);
  const PIE_COLORS = ["#4caf50", "#e0e0e0"];

  /* ===================== DATA ===================== */
  /* const defaultData = [
  { id: 1, year: 2025, operatingUnit: "PO BUKIDNON", pap: "TESD Program", kpi: "Beneficiaries", target: 100, accomplishment: 60, timeline: "Semestral", focalPerson: "JCDD" },
  { id: 2, year: 2025, operatingUnit: "PO BUKIDNON", pap: "Certification", kpi: "Trainees", target: 50, accomplishment: 45, timeline: "Quarterly", focalPerson: "HCC" }
];*/


 const [opcrData, setOpcrData] = useState([]);

 const [formData, setFormData] = useState({
  year: new Date().getFullYear(),
  operatingUnit: "",
  pap: "",
  kpi: "",
  target: 0,
  accomplishment: 0,
  timeline: "",
  focalPerson: ""
});


  const [editId, setEditId] = useState(null);
 

  /* ===================== FILTERS ===================== */
  const [filterOperatingUnit, setFilterOperatingUnit] = useState("");
  const [filterPap, setFilterPap] = useState("");
  const [filterKpi, setFilterKpi] = useState("");
  const [filterFocal, setFilterFocal] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterTimeline, setFilterTimeline] = useState("");

  /* ===================== USERS ===================== */
const [users, setUsers] = useState([]);

  const [newUser, setNewUser] = useState({ username: "", password: "", role: "guest" });
  const [editUserIndex, setEditUserIndex] = useState(null);
  const [editUserData, setEditUserData] = useState({ username: "", password: "", role: "guest" });


const loadUsers = () => {
  fetch("https://tesda-opcr-dashboard.onrender.com/api/users")
    .then(res => res.json())
    .then(data => {

      if (Array.isArray(data)) {
        console.log("Loaded users:", data.length);
        setUsers(data);
      } else {
        console.warn("Invalid users response:", data);
        setUsers([]);
      }

    })
    .catch(err => {
      console.error("Failed to load users:", err);
      setUsers([]);
    });
};

// Load KPI records
useEffect(() => {
  fetch("https://tesda-opcr-dashboard.onrender.com/api/opcr")
    .then(res => res.json())
    .then(data => {

      if (Array.isArray(data)) {
        console.log("Loaded from MySQL:", data.length);
        setOpcrData(data);
      } else {
        console.warn("Invalid API response:", data);
        setOpcrData([]);
      }

    })
    .catch(err => {
      console.error("Failed to load data:", err);
      setOpcrData([]);
    });
}, []);

// Load users
useEffect(() => {
  loadUsers();
}, []);

  useEffect(() => localStorage.setItem("opcrData", JSON.stringify(opcrData)), [opcrData]);
 

  /* ===================== HANDLERS ===================== */

const handleChange = e => {
  const value =
    e.target.type === "number"
      ? Number(e.target.value)
      : e.target.value;

  setFormData({
    ...formData,
    [e.target.name]: value
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...formData,
    year: Number(formData.year)
  };

  try {
    if (editId) {
      await fetch(`https://tesda-opcr-dashboard.onrender.com/api/opcr/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch("https://tesda-opcr-dashboard.onrender.com/api/opcr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    }

    // Reload data from MySQL
    const res = await fetch("https://tesda-opcr-dashboard.onrender.com/api/opcr");
    const data = await res.json();
    setOpcrData(data);

    setFormData({
      year: new Date().getFullYear(),
      operatingUnit: "",
      pap: "",
      kpi: "",
      target: 0,
      accomplishment: 0,
      timeline: "",
      focalPerson: ""
    });

    setEditId(null);

  } catch (err) {
    console.error(err);
    alert("Unable to save KPI.");
  }
};

const handleEdit = id => {
  const item = opcrData.find(d => d.id === id);
  setFormData(item);
  setEditId(id);
  setTimeout(() => kpiInputRef.current?.focus(), 100);
};

const handleDelete = async (id) => {

  if (!window.confirm("Delete KPI?")) return;

  try {

    await fetch(`https://tesda-opcr-dashboard.onrender.com/api/opcr/${id}`, {
      method: "DELETE"
    });

    // Reload latest data from MySQL
    const res = await fetch("https://tesda-opcr-dashboard.onrender.com/api/opcr");
    const data = await res.json();

    setOpcrData(data);

  } catch (err) {
    console.error(err);
    alert("Unable to delete KPI.");
  }

};
  /* ===================== FILTERED DATA ===================== */
  const filteredData = opcrData.filter(d =>
  (!filterYear || Number(d.year) === Number(filterYear)) &&
  (!filterOperatingUnit || d.operatingUnit === filterOperatingUnit) &&
  (!filterPap || d.pap === filterPap) &&
  (!filterKpi || d.kpi === filterKpi) &&
  (!filterFocal || d.focalPerson === filterFocal) &&
  (!filterTimeline || d.timeline === filterTimeline)
);
  /* ===================== CHART DATA ===================== */

  // KPI Chart
  const kpiChartData = filteredData.map(d => ({
    name: d.kpi,
    Target: d.target,
    Accomplishment: d.accomplishment
  }));

  // Yearly Performance Rating (%) — AVERAGE of ratings
const yearlyPerformanceData = Object.values(
  opcrData.reduce((acc, d) => {
    const year = d.year;

    if (!year) return acc; // safety guard

    if (!acc[year]) {
      acc[year] = {
        year,
        totalRating: 0,
        count: 0
      };
    }

  const rating = d.target
  ? Math.min(d.accomplishment / d.target, 1)
  : 0;
    acc[year].totalRating += rating;
    acc[year].count += 1;

    return acc;
  }, {})
).map(y => ({
  year: y.year,
  rating: Number(((y.totalRating / y.count) * 100).toFixed(1))
}));

// Yearly Overall Accomplishment (%) — average across all PAP/KPI for the selected year
/*const yearlyOverallAccomplishment = filteredData.reduce((acc, d) => {
  if (!d.year) return acc;
  return acc + (d.target
  ? Math.min(d.accomplishment / d.target, 1)
  : 0);
}, 0);

const totalItems = filteredData.length || 1; // prevent divide by zero

/*const yearlyOverallAccomplishmentData = [
  {
    name: "Accomplished",
    value: Number(((yearlyOverallAccomplishment / totalItems) * 100).toFixed(1))
  },
  {
    name: "Remaining",
    value: Number((100 - ((yearlyOverallAccomplishment / totalItems) * 100)).toFixed(1))
  }
];*/

  // PAP Performance Rating (%)
  const papPerformanceData = Object.values(
    filteredData.reduce((acc, d) => {
      if (!acc[d.pap]) acc[d.pap] = { pap: d.pap, target: 0, acc: 0 };
      acc[d.pap].target += d.target;
      acc[d.pap].acc += d.accomplishment;
      return acc;
    }, {})
  ).map(p => ({
    pap: p.pap,
    rating: p.target
  ? Number((Math.min(p.acc / p.target, 1) * 100).toFixed(1))
  : 0
  }));

  // Focal Person Performance Rating (%)
  const focalPerformanceData = Object.values(
  filteredData.reduce((acc, d) => {
    if (!acc[d.focalPerson]) {
      acc[d.focalPerson] = {
        name: d.focalPerson,
        totalRating: 0,
        count: 0
      };
    }

  const rating = d.target
  ? Math.min(d.accomplishment / d.target, 1)
  : 0;

    acc[d.focalPerson].totalRating += rating;
    acc[d.focalPerson].count += 1;

    return acc;
  }, {})
).map(f => ({
  name: f.name,
  rating: Number(((f.totalRating / f.count) * 100).toFixed(1))
}));

// Operating Unit Performance
const operatingUnitPerformanceData = Object.values(
  filteredData.reduce((acc, d) => {
    if (!acc[d.operatingUnit]) {
      acc[d.operatingUnit] = {
        unit: d.operatingUnit,
        totalRating: 0,
        count: 0
      };
    }

    const rating = d.target
      ? Math.min(d.accomplishment / d.target, 1)
      : 0;

    acc[d.operatingUnit].totalRating += rating;
    acc[d.operatingUnit].count += 1;

    return acc;
  }, {})
).map(u => ({
  unit: u.unit,
  rating: Number(((u.totalRating / u.count) * 100).toFixed(1))
}))
.sort((a, b) => b.rating - a.rating);
// Yearly Overall Accomplishment (%)
const totalRating = filteredData.length
  ? filteredData.reduce((sum, d) => sum + (d.target
  ? Math.min(d.accomplishment / d.target, 1)
  : 0), 0) / filteredData.length
  : 0;

const yearlyOverallData = [
  { name: "Accomplished", value: Number((totalRating * 100).toFixed(1)) },
  { name: "Remaining", value: Number((100 - totalRating * 100).toFixed(1)) }
];

// TOP 10 LOWEST PERFORMING KPIs
const lowestPerformingKPIs = [...filteredData]
  .map(d => ({
    ...d,
    rating: d.target
      ? Number(
          (Math.min(d.accomplishment / d.target, 1) * 100).toFixed(1)
        )
      : 0
  }))
  .filter(d => d.rating < 100) // Exclude fully accomplished KPIs
  .sort((a, b) => a.rating - b.rating)
  .slice(0, 10);
  
// TOP 5 BEST PERFORMING KPIs
const topBestKPIs = [...filteredData]
  .map(d => ({
    ...d,
    rating: d.target
      ? Number(
          (Math.min(d.accomplishment / d.target, 1) * 100).toFixed(1)
        )
      : 0
  }))
  .filter(d => d.rating > 0)
  .sort((a, b) => {
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return b.accomplishment - a.accomplishment;
  })
  .slice(0, 5);

  /* ===================== EXPORT ===================== */
  const exportChartToPDF = () => {
    html2canvas(chartRef.current).then(canvas => {
      const pdf = new jsPDF();
      const img = canvas.toDataURL("image/png");
      pdf.addImage(img, "PNG", 0, 0, 210, 120);
      pdf.save("OPCR_Charts.pdf");
    });
  };

  /* ===================== UI ===================== */
  const getRatingColor = (value) => {
  if (value <= 50) return "#f44336";      // Red
  if (value <= 74) return "#ffc107";      // Yellow
  return "#4caf50";                       // Green
};

const getPerformanceColor = (value) => {
  if (value <= 50) return "#E30613";     // Red
  if (value <= 74) return "#FFC107";     // Yellow
  return "#28A745";                      // Green
};

/* ===================== EXECUTIVE STATUS ===================== */

// Total KPI Records
const totalKPIs = filteredData.length;

// Completed KPIs
// Accomplishment is equal to or greater than the target
const completedKPIs = filteredData.filter(
  d => Number(d.accomplishment) >= Number(d.target)
).length;

// Ongoing KPIs
// Accomplishment is greater than zero but less than the target
const ongoingKPIs = filteredData.filter(
  d =>
    Number(d.accomplishment) > 0 &&
    Number(d.accomplishment) < Number(d.target)
).length;

// Delayed / Not Started KPIs
// Accomplishment is zero, null, undefined, or empty
const delayedKPIs = filteredData.filter(d => {
  const accomplishment = Number(d.accomplishment || 0);
  return accomplishment <= 0;
}).length;

// Overall Performance Rating
const overallRating = filteredData.length
  ? (
      filteredData.reduce((sum, d) => {
        const target = Number(d.target || 0);
        const accomplishment = Number(d.accomplishment || 0);

        return sum + (
          target > 0
            ? Math.min(accomplishment / target, 1)
            : 0
        );
      }, 0) / filteredData.length
    ) * 100
  : 0;

return (

  <div style={container}>

    {activeTab === "opcr" && (
      <>

    {/* TESDA EXECUTIVE HEADER */}
<div
  style={{
    background: "linear-gradient(135deg,#0038A8,#0057D9)",
    color: "#fff",
    padding: "20px",
    borderRadius: 12,
    marginBottom: 15,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    textAlign: "center"
  }}
>
  <h1
    style={{
      margin: 0,
      fontSize: 28,
      fontWeight: "bold",
      lineHeight: 1.2
    }}
  >
    TESDA Bukidnon Monitoring System
  </h1>

  <div
    style={{
      marginTop: 2,
      fontSize: 15,
      fontWeight: 500
    }}
  >
    Executive Monitoring Dashboard
  </div>

  <div
    style={{
      marginTop: 2,
      fontSize: 13,
      opacity: 0.95
    }}
  >
    Office Performance Commitment and Review Monitoring System
  </div>

  <div
    style={{
      marginTop: 4,
      fontSize: 13
    }}
  >
    Reporting Year: <strong>{filterYear || "All Years"}</strong>
  </div>
</div>

          {/* FILTERS */}
        <div
  style={{
    background: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
  }}
>
  <h3
    style={{
      marginTop: 0,
      marginBottom: 15,
      color: "#0038A8",
      fontWeight: "bold",
      borderLeft: "5px solid #0038A8",
      paddingLeft: 10
    }}
  >
    Dashboard Filters
  </h3>

  <div style={filterRow}>


           <select value={filterYear} onChange={e => setFilterYear(e.target.value)} 
           style={filterStyle}
           >
            <option value="">All Years</option>
              {[...new Set(opcrData.map(d => Number(d.year)))]
               .sort((a, b) => a - b)
               .map(y => (
            <option key={y} value={y}>{y}</option>
            ))}
          </select>

<select
  value={filterOperatingUnit}
  onChange={(e) => setFilterOperatingUnit(e.target.value)}
  style={filterStyle}

>
  <option value="">All Operating Units</option>
  <option value="PO BUKIDNON">PO BUKIDNON</option>
  <option value="PTC BUKIDNON">PTC BUKIDNON</option>
</select>

            <select
  value={filterPap}
  onChange={e => setFilterPap(e.target.value)}
  style={filterStyle}
>
  <option value="">All PAP</option>

  {[...new Set(opcrData.map(d => d.pap))].map(p => (
    <option
      key={p}
      value={p}
      title={p}
    >
      {p}
    </option>
  ))}
</select>

          <select
  value={filterKpi}
  onChange={e => setFilterKpi(e.target.value)}
  style={filterStyle}

>
  <option value="">All KPI</option>
  {[...new Set(opcrData.map(d => d.kpi))].map(k => (
    <option key={k} value={k} title={k}>
      {k}
    </option>
  ))}
</select>

            <select value={filterFocal} onChange={e => setFilterFocal(e.target.value)}
              style={filterStyle}
              >
              <option value="">All Focal Person</option>
              {[...new Set(opcrData.map(d => d.focalPerson))].map(f => <option key={f}>{f}</option>)}
            </select>

<select
  value={filterTimeline}
  onChange={e => setFilterTimeline(e.target.value)}
  style={filterStyle}
>
  <option value="">All Timelines</option>

  {[...new Set(opcrData.map(d => d.timeline))]
    .filter(Boolean)
    .map(t => (
      <option key={t} value={t}>
        {t}
      </option>
  ))}
</select>

            <button
  style={{
    background: "#E30613",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "bold"
  }}
  onClick={() => {
              setFilterYear("");
setFilterOperatingUnit("");
setFilterPap("");
setFilterKpi("");
setFilterFocal("");
setFilterTimeline(""); }}>
              Clear Filters
            </button>
          </div>
</div>
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
{/* SUMMARY CARDS */}

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

  
<h3
  style={{
    marginTop: 25,
    marginBottom: 10,
    color: "#E30613",
    fontWeight: "bold"
  }}
>

{/* PERFORMANCE BY OPERATING UNIT */}

<ChartBox title="Performance by Operating Unit (%)">
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

    <Tooltip formatter={(v) => `${v}%`} />

    <Bar dataKey="rating">
      {operatingUnitPerformanceData.map((entry, index) => (
        <Cell
          key={index}
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
    <LegendItem color="#f44336" label="0–50% Needs Improvement" />
    <LegendItem color="#ffc107" label="51–74% Satisfactory" />
    <LegendItem color="#4caf50" label="75–100% Outstanding" />
  </div>
</ChartBox>
</h3>



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

             <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
 

  {/* Pie Chart */}
  <div style={{ flex: 1, minWidth: 300 }}>
    <ChartBox title="Yearly Overall Accomplishment (%)"
       annotation="📌 Based on Filtered records">
  <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
  </div>
      <PieChart width={300} height={300}>
        <Pie
  data={yearlyOverallData}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  outerRadius={80}
  label={({ value }) => `${value}%`} // show % on pie slices
>
         {yearlyOverallData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
  ))}
</Pie>
        <Tooltip formatter={v => `${v}%`} />
        <Legend />
      </PieChart>
    </ChartBox>
  </div>

  {/* Focal Person Chart */}
  <div style={{ flex: 1, minWidth: 300 }}>
    <ChartBox title="Focal Person Performance Rating (%)">
  <BarChart data={focalPerformanceData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
    <Tooltip formatter={v => `${v}%`} />

    <Bar dataKey="rating">
      {focalPerformanceData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={getRatingColor(entry.rating)} />
      ))}
    </Bar>
  </BarChart>

  {/* Legend */}
  <div style={{ display: "flex", gap: 15, marginTop: 10, fontSize: 12 }}>
    <LegendItem color="#f44336" label="0–50% (Needs Improvement)" />
    <LegendItem color="#ffc107" label="51–74% (Satisfactory)" />
    <LegendItem color="#4caf50" label="75–100% (Outstanding)" />
  </div>
</ChartBox>
  </div>
</div>



          {/* CHARTS */}
        
         
         
          <div
  ref={chartRef}
  style={{
    marginBottom: 50,
    display: "flex",
    flexDirection: "column",
    gap: 35
  }}
>
           
            <ChartBox title="KPI Target vs Accomplishment">
              <BarChart data={kpiChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Target" fill="#1976d2" />
                <Bar dataKey="Accomplishment" fill="#4caf50" />
              </BarChart>
            </ChartBox>

          <ChartBox title="PAP Performance Rating (%)">
            <BarChart data={papPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pap" />
              <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={v => `${v}%`} />

                <Bar dataKey="rating">
                  {papPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRatingColor(entry.rating)} />
                ))}
             </Bar>
       </BarChart>

  {/* Legend */}
  <div style={{ display: "flex", gap: 15, marginTop: 10, fontSize: 12 }}>
    <LegendItem color="#f44336" label="0–50% (Needs Improvement)" />
    <LegendItem color="#ffc107" label="51–74% (Satisfactory)" />
    <LegendItem color="#4caf50" label="75–100% (Outstanding)" />
  </div>
</ChartBox>



           <ChartBox title="🔒 Yearly Performance Rating (%)"
           annotation="📌 Based on all records (not affected by filters)">
  <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
  </div>

  <BarChart data={yearlyPerformanceData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="year" />
    <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
    <Tooltip formatter={v => `${v}%`} />

    <Bar dataKey="rating" fill="#03a9f4" />
    <Line
      type="monotone"
      dataKey="rating"
      stroke="#ff5722"
      strokeWidth={2}
      dot={{ r: 4 }}
    />
  </BarChart>
</ChartBox>

          </div>

          <button onClick={exportChartToPDF} style={btn}>Export Charts PDF</button>


<h3
  style={{
    marginTop: 25,
    marginBottom: 10,
    color: "#E30613",
    fontWeight: "bold"
  }}
>

  🔻 TOP 10 KPIs REQUIRING MANAGEMENT ATTENTION
</h3>
<div
  style={{
    background: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch"
  }}
>
  <table
  width="100%"
  cellPadding="8"
  style={{
    minWidth: "900px",
    borderCollapse: "collapse"
  }}
>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Operating Unit</th>
        <th>PAP</th>
        <th>KPI</th>
        <th>Rating</th>
      </tr>
    </thead>

    <tbody>
      {lowestPerformingKPIs.map((kpi, index) => (
        <tr key={kpi.id}>
          <td>{index + 1}</td>
          <td>{kpi.operatingUnit}</td>
          <td>{kpi.pap}</td>
          <td>{kpi.kpi}</td>

          <td
            style={{
              fontWeight: "bold",
              color:
                kpi.rating <= 50
                  ? "#f44336"
                  : kpi.rating <= 74
                  ? "#ffc107"
                  : "#4caf50"
            }}
          >
            {kpi.rating}%
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


<h3
  style={{
    marginBottom: 12,
    marginTop: 20,
    color: "#4caf50",
    fontWeight: "bold",
    borderLeft: "5px solid #4caf50",
    paddingLeft: 10
  }}
>
  🏆 TOP 5 BEST PERFORMING KPIs
</h3>

<div
  style={{
    background: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch"
  }}
>
  <table
  width="100%"
  cellPadding="8"
  style={{
    minWidth: "900px",
    borderCollapse: "collapse"
  }}
>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Operating Unit</th>
        <th>PAP</th>
        <th>KPI</th>
        <th>Rating</th>
      </tr>
    </thead>

    <tbody>
      {topBestKPIs.map((kpi, index) => (
        <tr key={kpi.id}>
          <td>{index + 1}</td>
          <td>{kpi.operatingUnit}</td>
          <td>{kpi.pap}</td>
          <td>{kpi.kpi}</td>
          <td
            style={{
              fontWeight: "bold",
              color: "#4caf50"
            }}
          >
            {kpi.rating}%
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


<h3
  style={{
    marginTop: 20,
    marginBottom: 5,
    color: "#0038A8",
    fontWeight: "bold",
    borderLeft: "5px solid #0038A8",
    paddingLeft: 10
  }}
>
  KPI Detailed Performance Monitoring
</h3>
          {/* TABLE */}
        <div
  style={{
    ...box,
    marginTop: 0,
    overflowX: "auto",
    WebkitOverflowScrolling: "touch"
  }}
>
  <table
  width="100%"
  border="1"
  cellPadding="8"
  style={{
    minWidth: "1200px",
    borderCollapse: "collapse"
  }}
>
              <thead>
                <tr>
                  <th>Year</th><th>Operating Unit</th><th>PAP</th><th>KPI</th><th>Target</th><th>Accomplishment</th><th>Rating %</th><th>Timeline</th><th>Focal</th>
                  {role === "admin" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.map(d => (
                  <tr key={d.id}>
                    <td>{d.year}</td>
                    <td>{d.operatingUnit}</td>
                    <td>{d.pap}</td>
                    <td>{d.kpi}</td>
                    <td>{d.target}</td>
                    <td>{d.accomplishment}</td>
                   <td
                  style={{
                  fontWeight: "bold",
                 color: getPerformanceColor(
               d.target
        ? Math.min((d.accomplishment / d.target) * 100, 100)
        : 0
                   )
                    }}
                    >
                    {d.target
    ? Math.min((d.accomplishment / d.target) * 100, 100).toFixed(1)
    : 0}%
                    </td>
                    <td>{d.timeline}</td>
                    <td>{d.focalPerson}</td>
                    {role === "admin" && (
                      <td>
                        <button onClick={() => handleEdit(d.id)}>Edit</button>
                        <button onClick={() => handleDelete(d.id)}>Delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* KPI FORM */}
          {role === "admin" && (
            <div style={box}>
              <h3>{editId ? "Edit KPI" : "Add KPI"}</h3>
              <form onSubmit={handleSubmit} style={form}>
               
{Object.keys(formData).map((k) => (
  <div
    key={k}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 4,
      flex: "1 1 220px"
    }}
  >
    <label
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: "#555"
      }}
    >
      {k.toUpperCase()}
    </label>

    
{k === "operatingUnit" ? (
  <select
    name="operatingUnit"
    value={formData.operatingUnit}
    onChange={handleChange}
    style={{
      padding: "8px 10px",
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: 14
    }}
  >
    <option value="">Select Operating Unit</option>
    <option value="PO BUKIDNON">PO BUKIDNON</option>
      <option value="PTC BUKIDNON">PTC BUKIDNON</option>
 
  </select>
) : (
  <input
    name={k}
    ref={k === "kpi" ? kpiInputRef : null}
    value={formData[k]}
    onChange={handleChange}
    type={
      ["year", "target", "accomplishment"].includes(k)
        ? "number"
        : "text"
    }
    style={{
      padding: "8px 10px",
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: 14
    }}
  />
)}


  </div>
))}

                <button style={btn}>Save</button>
              </form>
            </div>
          )}




        </>
      )}

      {/* USERS */}
      {activeTab === "users" && role === "admin" && (
        <div style={box}>
          <h3>User Management</h3>
       <form
  onSubmit={async (e) => {
    e.preventDefault();

    try {

      if (editUserIndex !== null) {

        await fetch(
          `https://tesda-opcr-dashboard.onrender.com/api/users/${editUserData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(editUserData)
          }
        );

        setEditUserIndex(null);

      } else {

        await fetch(
          "https://tesda-opcr-dashboard.onrender.com/api/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
          }
        );

        setNewUser({
          username: "",
          password: "",
          role: "guest"
        });

      }

      loadUsers();

    } catch (err) {
      console.error(err);
      alert("Database error");
    }
  }}
>
            <input placeholder="Username" value={editUserIndex !== null ? editUserData.username : newUser.username}
              onChange={e => editUserIndex !== null ? setEditUserData({ ...editUserData, username: e.target.value }) : setNewUser({ ...newUser, username: e.target.value })} />
            <input placeholder="Password" value={editUserIndex !== null ? editUserData.password : newUser.password}
              onChange={e => editUserIndex !== null ? setEditUserData({ ...editUserData, password: e.target.value }) : setNewUser({ ...newUser, password: e.target.value })} />
            <select value={editUserIndex !== null ? editUserData.role : newUser.role}
              onChange={e => editUserIndex !== null ? setEditUserData({ ...editUserData, role: e.target.value }) : setNewUser({ ...newUser, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="guest">Guest</option>
            </select>
            <button style={btn}>{editUserIndex !== null ? "Update" : "Add"} User</button>
          </form>

<hr style={{ margin: "20px 0" }} />

<table
  style={{
    width: "100%",
    borderCollapse: "collapse"
  }}
>
  <thead>
    <tr style={{ background: "#1976d2", color: "white" }}>
      <th>ID</th>
      <th>Username</th>
      <th>Role</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {users.map(user => (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.username}</td>
        <td>{user.role}</td>

        <td>

          <button
            style={btn}
            onClick={() => {
              setEditUserIndex(user.id);
              setEditUserData(user);
            }}
          >
            Edit
          </button>

          <button
            style={{
              ...btn,
              background: "#d32f2f",
              marginLeft: 8
            }}
            onClick={async () => {

              if (!window.confirm("Delete this user?")) return;

              await fetch(
                `https://tesda-opcr-dashboard.onrender.com/api/users/${user.id}`,
                {
                  method: "DELETE"
                }
              );

              loadUsers();

            }}
          >
            Delete
          </button>

        </td>

      </tr>
    ))}
  </tbody>

</table>

        </div>
      )}

 {/* ===================== FOOTER ===================== */}
<footer
  style={{
    marginTop: 40,
    background: "#0038A8",
    color: "#fff",
    padding: "25px 20px",
    borderTop: "5px solid #E30613",
    textAlign: "center",
    borderRadius: "10px 10px 0 0"
  }}
>
  <div
    style={{
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 8
    }}
  >
    🇵🇭 TESDA Bukidnon Provincial Office
  </div>

  <div
    style={{
      fontSize: 16,
      fontWeight: 500,
      marginBottom: 5
    }}
  >
    Office Performance Commitment and Review (OPCR)
  </div>

  <div
    style={{
      fontSize: 14,
      opacity: 0.95,
      marginBottom: 15
    }}
  >
    Executive Monitoring Dashboard
  </div>

  <hr
    style={{
      border: "none",
      borderTop: "1px solid rgba(255,255,255,.30)",
      margin: "15px auto",
      width: "90%"
    }}
  />

  <div
    style={{
      fontSize: 14,
      lineHeight: 1.8
    }}
  >
    <strong>Program and Developed by</strong>
    <br />
    <span
      style={{
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFD54F"
      }}
    >
      Mat Perater Macote
    </span>

    <br />

    Technical Support Staff

    <br /><br />

    Version 1.0.0

    <br />

    © {new Date().getFullYear()} TESDA Bukidnon Provincial Office

    <br />

    All Rights Reserved
  </div>
</footer>
      
    </div>
  );
}

/* ===================== HELPERS ===================== */
const ChartBox = ({ title, annotation, children }) => (
  <div style={{ background: "#fff", padding: 20, marginBottom: 30, borderRadius: 10 }}>
    <h3 style={{ marginBottom: 4 }}>{title}</h3>

    {annotation && (
      <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
        {annotation}
      </div>
    )}

    <ResponsiveContainer width="100%" height={280}>
      {children}
    </ResponsiveContainer>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <span
      style={{
        width: 12,
        height: 12,
        backgroundColor: color,
        display: "inline-block",
        borderRadius: 2
      }}
    />
    <span>{label}</span>
  </div>
);


/*------SUMMARY CARD--------*/
const SummaryCard = ({ title, value, color }) => {

  const getIcon = () => {

    if (title.includes("Total"))
      return "📊";

    if (title.includes("Completed"))
      return "✅";

    if (title.includes("Ongoing"))
      return "🟡";

    if (title.includes("Delayed"))
      return "🔴";

    if (title.includes("Rating"))
      return "⭐";

    if (title.includes("PAP"))
      return "📁";

    return "📌";
  };

  return (

    <div
      style={{
        background: "#ffffff",
        borderRadius: 14,
        padding: 20,
        borderLeft: `7px solid ${color}`,
        boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
        transition: "all .25s ease",
        cursor: "pointer"
      }}

      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 12px 24px rgba(0,0,0,.18)";
      }}

      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow =
          "0 8px 18px rgba(0,0,0,.08)";
      }}

    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >

        <div>

          <div
            style={{
              fontSize: 13,
              color: "#666",
              fontWeight: 600,
              marginBottom: 8
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 34,
              fontWeight: "bold",
              color
            }}
          >
            {value}
          </div>

        </div>

        <div
          style={{
            fontSize: 42
          }}
        >
          {getIcon()}
        </div>

      </div>

    </div>

  );

};

/*------OVERALL PERFORMANCE GAUGE--------*/
const OverallPerformanceGauge = ({ value }) => {

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
        {
          value >= 75
            ? "Excellent"
            : value >= 50
            ? "Needs Attention"
            : "Critical"

    
        }
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

};


/* ===================== STYLES ===================== */
const container = {
  padding: 15,
  background: "#f4f6f8",
  minHeight: "100vh",
  maxWidth: "1600px",
  margin: "0 auto"
};
const box = { background: "#fff", padding: 20, marginTop: 20, borderRadius: 10 };
const form = { display: "flex", gap: 10, flexWrap: "wrap" };
const btn = { padding: "8px 16px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 5 };
const filterRow = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
  alignItems: "center"
};
const filterStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px",
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14
};
export default OPCRDashboard;
