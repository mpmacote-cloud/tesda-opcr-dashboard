import OPCRDashboard from "./OPCRDashboard";
import { useNavigate } from "react-router-dom";

function Dashboard({ role, setRole }) {
  const navigate = useNavigate();

  if (!role) {
    return <h2 style={{ padding: 30 }}>Access denied. Please go back to Home.</h2>;
  }

  const handleLogout = () => {
    setRole(null);
    navigate("/");
  };

  return (
    <div>
      <div style={topBar}>
        <h2>OPCR Dashboard</h2>
        <div>
          <span>User type: <b>{role.toUpperCase()}</b></span>
          <button onClick={handleLogout} style={logoutBtn}>Logout</button>
        </div>
      </div>

      <OPCRDashboard role={role} />
    </div>
  );
}

const topBar = {
  padding: 15,
  background: "#1976d2",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const logoutBtn = {
  marginLeft: 20,
  padding: "5px 10px",
  borderRadius: 5,
  border: "none",
  backgroundColor: "#f44336",
  color: "white",
  cursor: "pointer"
};

export default Dashboard;
