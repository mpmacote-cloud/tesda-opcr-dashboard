import { useState, useEffect } from "react";
import OPCRDashboard from "./OPCRDashboard";
import Particles from "react-tsparticles";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";



function App() {
  const [role, setRole] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPrivacy, setShowPrivacy] = useState(true);
  const [activeTab, setActiveTab] = useState("opcr");
  const [operatingUnit, setOperatingUnit] = useState("");
const [focalship, setFocalship] = useState("");
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
  
  useEffect(() => {

  const token = localStorage.getItem("token");
  const savedRole = localStorage.getItem("role");
  const savedOperatingUnit = localStorage.getItem("operatingUnit");
  const savedFocalship = localStorage.getItem("focalship");

  if (token && savedRole) {

    setRole(savedRole);

    setOperatingUnit(savedOperatingUnit || "");

    setFocalship(savedFocalship || "");

  }

}, []);

const isSystemAdmin = role === "system_admin";

const isAdministrator = role === "administrator";



  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    console.log("API URL:", process.env.REACT_APP_API_URL);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();

   if (result.success) {

 localStorage.setItem("token", result.token);
localStorage.setItem("role", result.role);
localStorage.setItem("username", result.username);
localStorage.setItem("operatingUnit", result.operatingUnit);
localStorage.setItem("focalship", result.focalship);

setRole(result.role);
setOperatingUnit(result.operatingUnit || "");
setFocalship(result.focalship || "");

setShowLogin(false);

setLoginData({
  username: "",
  password: "",
});
}
    
    else {
      toast.error("Invalid username or password!");
    }
  } catch (err) {
    console.error(err);
    toast.error("Cannot connect to the server.");
  }
};

  const handleLogout = () => {

localStorage.removeItem("token");
localStorage.removeItem("role");
localStorage.removeItem("username");
localStorage.removeItem("operatingUnit");
localStorage.removeItem("focalship");


  setRole(null);
  setOperatingUnit("");
  setFocalship("");
 /* setUsername("");*/

};

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
            <button onClick={() => setShowLogin(true)} className="home-btn">Login</button>
          </div>

          {showLogin && (
            <form onSubmit={handleLogin} className="login-form">
              <h3>Login</h3>
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
                <button
  type="button"
  className="privacy-link"
  onClick={() => alert("Privacy Notice coming soon.")}
  style={{
    background: "none",
    border: "none",
    color: "#1976d2",
    textDecoration: "underline",
    cursor: "pointer",
    padding: 0,
    font: "inherit"
  }}
>
  Privacy Notice
</button>
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

  {/* Desktop Menu */}
  <div className="desktop-menu">

    <div
      className="nav-item"
      onClick={() => window.location.reload()}
    >
      Home
    </div>

    <div className="nav-item">
      About Us
    </div>

    <div className="dropdown nav-item">
      Monitoring System

      <div className="dropdown-content">

        <div onClick={() => setActiveTab("opcr")}>
          OPCR Dashboard
        </div>

        {(isSystemAdmin || isAdministrator) && (
          <div onClick={() => setActiveTab("users")}>
            User Management
          </div>
        )}

        <div>
          Bukidnon TVET Situationer
        </div>

      </div>
    </div>

    <div className="user-menu">

      <div className="user-button">

        👤

        <span>
          {
            isSystemAdmin
              ? "System Administrator"
              : isAdministrator
              ? "Administrator"
              : "User"
          }
        </span>

        ▼

      </div>

      <div className="user-dropdown">

        <div
          className="logout-item"
          onClick={handleLogout}
        >
          Logout
        </div>

      </div>

    </div>

  </div>

  {/* Mobile Hamburger */}
  <button
    className="hamburger"
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  >
    ☰
  </button>

</div>
   </div>

{mobileMenuOpen && (
  <div className="mobile-menu">

    <div
      className="mobile-item"
      onClick={() => {
        window.location.reload();
        setMobileMenuOpen(false);
      }}
    >
      🏠 Home
    </div>

    <div
      className="mobile-item"
      onClick={() => {
        setActiveTab("opcr");
        setMobileMenuOpen(false);
      }}
    >
      📊 OPCR Dashboard
    </div>

    {(isSystemAdmin || isAdministrator) && (
      <div
        className="mobile-item"
        onClick={() => {
          setActiveTab("users");
          setMobileMenuOpen(false);
        }}
      >
        👥 User Management
      </div>
    )}

    <div className="mobile-item">
      📈 Bukidnon TVET Situationer
    </div>

    <div
      className="mobile-item"
      onClick={() => {
        handleLogout();
        setMobileMenuOpen(false);
      }}
    >
      🚪 Logout
    </div>

  </div>
)}


<OPCRDashboard
    role={role}
    operatingUnit={operatingUnit}
    focalship={focalship}
    activeTab={activeTab}
    setActiveTab={setActiveTab}
/>

<ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnHover
/>
    </div>
  );
}

export default App;
