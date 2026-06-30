import { useState } from "react";
import OPCRDashboard from "./OPCRDashboard";
import Particles from "react-tsparticles";
import "./App.css";

function App() {
  const [role, setRole] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPrivacy, setShowPrivacy] = useState(true);
  const [activeTab, setActiveTab] = useState("opcr");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();

    if (result.success) {
      setRole(result.role);
      setShowLogin(false);
      setLoginData({
        username: "",
        password: "",
      });
    } else {
      alert("Invalid username or password!");
    }
  } catch (err) {
    console.error(err);
    alert("Cannot connect to the server.");
  }
};

  const handleLogout = () => setRole(null);

  // ---------- HOMEPAGE ----------
  if (!role) {
    return (
      <div className="tesda-bg">
        <Particles
          options={{
            background: { color: "transparent" },
            fpsLimit: 60,
            interactivity: { events: { onHover: { enable: true, mode: "repulse" } } },
            particles: {
              color: { value: "#ffffff" },
              links: { enable: true, color: "#ffffff", distance: 150 },
              move: { enable: true, speed: 1 },
              number: { value: 40 },
              opacity: { value: 0.5 },
              size: { value: { min: 1, max: 3 } }
            }
          }}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
        />
        <div className="tesda-ribbon"></div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <img src="/tesda-logo.png" alt="TESDA Logo" className="tesda-logo" />
          <h1>TESDA Bukidnon Monitoring System</h1>

          <div className="home-buttons">
            <button onClick={() => setShowLogin(true)} className="home-btn">Admin Login</button>
            <button onClick={() => setRole("guest")} className="home-btn">Continue as Guest</button>
          </div>

          {showLogin && (
            <form onSubmit={handleLogin} className="login-form">
              <h3>Admin Login</h3>
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <div className="login-buttons">
                <button type="submit" className="login-btn">Login</button>
                <button type="button" onClick={() => setShowLogin(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          )}

          {showPrivacy && (
            <div className="privacy-banner">
              <p>
                We respect your privacy. By using this system, you agree to our&nbsp;
                <a href="#">Privacy Notice</a>.
              </p>
              <button className="privacy-btn" onClick={() => setShowPrivacy(false)}>Agree</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD PAGE ----------
  return (
    <div>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <img src="/tesda-logo.png" alt="TESDA Logo" className="nav-logo" />
          <h3>TESDA Bukidnon</h3>
        </div>
        <div className="nav-right">
          <div className="nav-item" onClick={() => window.location.reload()}>Home</div>
          <div className="nav-item">About Us</div>
        <div className="dropdown nav-item">
  Monitoring System
  <div className="dropdown-content">

    <div onClick={() => setActiveTab("opcr")}>
      OPCR Dashboard
    </div>

    {role === "admin" && (
      <div onClick={() => setActiveTab("users")}>
        User Management
      </div>
    )}

    <div>
      Bukidnon TVET Situationer
    </div>

  </div>
</div>
          <span className="nav-user">User: <b>{role.toUpperCase()}</b></span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <OPCRDashboard
  role={role}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
/>
    </div>
  );
}

export default App;
