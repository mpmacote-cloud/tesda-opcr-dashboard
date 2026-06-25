import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// -------------------- HOMEPAGE --------------------
function Homepage({ role }) {
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [monitoringOpen, setMonitoringOpen] = useState(false);

  const handlePageChange = page => {
    setActivePage(page);
    setMenuOpen(false);
    setMonitoringOpen(false);
  };

  return (
    <div>
      {/* --- Navbar --- */}
      <nav style={nav}>
        <div style={logo}>TESDA Bukidnon</div>

        <div style={hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</div>

        <ul style={{ ...navMenu, display: menuOpen ? "flex" : "none" }}>
          <li style={navItem} onClick={() => handlePageChange("home")}>Home</li>
          <li style={navItem} onClick={() => handlePageChange("about")}>About Us</li>

          <li
            style={navItem}
            onMouseEnter={() => setMonitoringOpen(true)}
            onMouseLeave={() => setMonitoringOpen(false)}
            onClick={() => setMonitoringOpen(!monitoringOpen)}
          >
            Monitoring System ▾
            <ul style={{ ...dropdown, display: monitoringOpen ? "block" : "none" }}>
              <li style={dropdownItem} onClick={() => handlePageChange("opcr")}>OPCR Dashboard</li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* --- Page Content --- */}
      <div style={{ padding: 20 }}>
        {activePage === "home" && (
          <div>
            <h1>Welcome to TESDA Bukidnon</h1>
            <p>
              TESDA Bukidnon provides technical education and skills development for the local community.
            </p>
          </div>
        )}

        {activePage === "about" && (
          <div>
            <h1>About Us</h1>
            <p>
              TESDA Bukidnon aims to enhance the skills of Filipinos in various technical fields and support workforce development.
            </p>
          </div>
        )}

        {activePage === "opcr" && <OPCRDashboard role={role} />}
      </div>
    </div>
  );
}

// -------------------- OPCR DASHBOARD --------------------
function OPCRDashboard({ role }) {
  const chartRef = useRef(null);
  const kpiRef = useRef(null);

  // -------------------- STATE --------------------
  const [opcrData, setOpcrData] = useState(() => {
    const saved = localStorage.getItem("opcrData");
    return saved ? JSON.parse(saved) : [
      { id: 1, pap: "Community Outreach", kpi: "Number of beneficiaries", target: 100, timeline: "Semestral", budget: 75000, focalPerson: "Maria Santos", accomplishment: 60 },
      { id: 2, pap: "Training on ICT", kpi: "Number of trainees", target: 50, timeline: "Quarterly", budget: 50000, focalPerson: "Juan Dela Cruz", accomplishment: 20 }
    ];
  });

  const [formData, setFormData] = useState({
    pap: "", kpi: "", target: 0, timeline: "", budget: 0, focalPerson: "", accomplishment: 0
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // -------------------- EFFECTS --------------------
  useEffect(() => localStorage.setItem("opcrData", JSON.stringify(opcrData)), [opcrData]);

  useEffect(() => {
    if (editId !== null && kpiRef.current) kpiRef.current.focus();
  }, [editId]);

  // -------------------- HANDLERS --------------------
  const handleChange = e => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.pap || !formData.kpi) return alert("PAP and KPI required");

    if (editId !== null) {
      const updated = opcrData.map(item => item.id === editId ? { ...item, ...formData } : item);
      setOpcrData(updated);
    } else {
      const newItem = { ...formData, id: Date.now() };
      setOpcrData([...opcrData, newItem]);
    }

    setFormData({ pap: "", kpi: "", target: 0, timeline: "", budget: 0, focalPerson: "", accomplishment: 0 });
    setEditId(null);
  };

  const handleEdit = id => {
    const item = opcrData.find(d => d.id === id);
    setFormData({ ...item });
    setEditId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = id => {
    if (!window.confirm("Delete this KPI?")) return;
    setOpcrData(opcrData.filter(d => d.id !== id));
  };

  // -------------------- FILTER & SORT --------------------
  const filteredSortedData = [...opcrData]
    .filter(item =>
      item.pap.toLowerCase().includes(search.toLowerCase()) ||
      item.kpi.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.pap.localeCompare(b.pap));

  // -------------------- SUMMARY --------------------
  const totalKPI = filteredSortedData.length;
  const totalTarget = filteredSortedData.reduce((s, i) => s + i.target, 0);
  const totalAcc = filteredSortedData.reduce((s, i) => s + i.accomplishment, 0);

  const chartData = filteredSortedData.map(i => ({
    pap: i.pap,
    kpi: i.kpi,
    Target: i.target,
    Accomplishment: i.accomplishment,
    Remaining: i.target - i.accomplishment
  }));

  // -------------------- EXPORT --------------------
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredSortedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OPCR");
    XLSX.writeFile(wb, "OPCR.xlsx");
  };

  const exportChartToPDF = () => {
    html2canvas(chartRef.current).then(canvas => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, w, h);
      pdf.save("KPI_Chart.pdf");
    });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div style={{ background: "white", padding: 10, border: "1px solid #ccc" }}>
          <b>PAP:</b> {d.pap}<br />
          <b>KPI:</b> {d.kpi}<br /><br />
          <b>Target:</b> {d.Target}<br />
          <b>Accomplishment:</b> {d.Accomplishment}<br />
          <b>Remaining:</b> {d.Remaining}
        </div>
      );
    }
    return null;
  };

  // -------------------- RENDER --------------------
  return (
    <div>
      {/* Summary */}
      <div style={summaryRow}>
        <div style={summaryCard}><h4>KPI Count</h4><h2>{totalKPI}</h2></div>
        <div style={summaryCard}><h4>Total Target</h4><h2>{totalTarget}</h2></div>
        <div style={summaryCard}><h4>Total Accomplishment</h4><h2>{totalAcc}</h2></div>
      </div>

      {/* Chart */}
      <div style={box}>
        <h3>Performance Chart</h3>
        <button style={btn} onClick={exportChartToPDF}>Export Chart PDF</button>
        <div ref={chartRef}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="kpi" interval={0} angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Target" fill="#1976d2" />
              <Bar dataKey="Accomplishment" fill="#4caf50" />
              <Bar dataKey="Remaining" fill="#f44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search & Export */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        <input style={input} placeholder="Search PAP or KPI..." value={search} onChange={e => setSearch(e.target.value)} />
        <button style={btn} onClick={exportToExcel}>Export Excel</button>
      </div>

      {/* KPI Form */}
      {role === "admin" && (
        <div style={box}>
          <h3>{editId ? "Edit KPI" : "Add KPI"}</h3>
          <form onSubmit={handleSubmit} style={form}>
            {Object.keys(formData).map((k) => (
              <input
                key={k}
                name={k}
                ref={k === "kpi" ? kpiRef : null}
                type={["target","budget","accomplishment"].includes(k) ? "number" : "text"}
                placeholder={k.toUpperCase()}
                value={formData[k]}
                onChange={handleChange}
                style={input}
              />
            ))}
            <button style={btn}>Save</button>
          </form>
        </div>
      )}

      {/* KPI Table */}
      <div style={{ ...box, overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 700 }} border="1" cellPadding="8">
          <thead style={{ background: "#eaeaea" }}>
            <tr>
              <th>PAP</th><th>KPI</th><th>Target</th><th>Timeline</th><th>Budget</th><th>Focal Person</th><th>Accomplishment</th>
              {role === "admin" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredSortedData.map(d => (
              <tr key={d.id}>
                <td>{d.pap}</td><td>{d.kpi}</td><td>{d.target}</td><td>{d.timeline}</td>
                <td>{d.budget}</td><td>{d.focalPerson}</td><td>{d.accomplishment}</td>
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
    </div>
  );
}

// -------------------- STYLES --------------------
const nav = { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 20px", background:"#003DA5", color:"white", position:"sticky", top:0, zIndex:999, flexWrap:"wrap" };
const logo = { fontWeight:"bold", fontSize:18 };
const hamburger = { display:"block", fontSize:24, cursor:"pointer" };
const navMenu = { listStyle:"none", display:"flex", gap:20, margin:0, padding:0, flexDirection:"row", flexWrap:"wrap" };
const navItem = { position:"relative", cursor:"pointer", padding:"5px 10px" };
const dropdown = { position:"absolute", top:"100%", left:0, background:"#1976d2", listStyle:"none", padding:0, margin:0, minWidth:180, borderRadius:5, boxShadow:"0 2px 5px rgba(0,0,0,0.3)", zIndex:10 };
const dropdownItem = { padding:"10px 15px", cursor:"pointer", color:"white", borderBottom:"1px solid rgba(255,255,255,0.2)" };
const box = { background:"white", padding:20, borderRadius:10, marginTop:20 };
const summaryRow = { display:"flex", gap:20, flexWrap:"wrap" };
const summaryCard = { background:"white", padding:20, borderRadius:10, minWidth:180, flex:1 };
const form = { display:"flex", gap:10, flexWrap:"wrap", marginTop:10 };
const input = { padding:10, borderRadius:5, border:"1px solid #ccc", flex:"1 1 200px", minWidth:150 };
const btn = { padding:"10px 20px", background:"#1976d2", color:"white", border:"none", borderRadius:5, cursor:"pointer" };

export default Homepage;
