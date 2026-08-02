import Navbar from "./components/layout/Navbar";
import MobileMenu from "./components/layout/MobileMenu";
import LoginForm from "./components/LoginForm";
// React
import { useState, useEffect } from "react";
// Components
import OPCRDashboard from "./OPCRDashboard";
// Third-party Libraries
import Particles from "react-tsparticles";
import { ToastContainer, toast } from "react-toastify";
// Styles
import "react-toastify/dist/ReactToastify.css";
import "./App.css";




function App() {
// Authentication
const [role, setRole] = useState(null);
const [showLogin, setShowLogin] = useState(false);

const [loginData, setLoginData] = useState({
    username: "",
    password: ""
});

// User Context
const [operatingUnit, setOperatingUnit] = useState("");
const [focalship, setFocalship] = useState("");

// Navigation
const [activeTab, setActiveTab] = useState("opcr");
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// UI
const [showPrivacy, setShowPrivacy] = useState(true);
 
  // Load Saved Session
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

// Role Helpers
const isSystemAdmin = role === "system_admin";
const isAdministrator = role === "administrator";

// Authentication
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();

 if (!result.success) {
  toast.error(result.message || "Invalid username or password!");
return;
}

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

};
  // ---------- DASHBOARD PAGE ----------
 return (
  <>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
    />

    {!role ? (

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
  <LoginForm
    loginData={loginData}
    setLoginData={setLoginData}
    handleLogin={handleLogin}
    setShowLogin={setShowLogin}
  />
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
    ) : (
      <div>

        <Navbar
          isSystemAdmin={isSystemAdmin}
          isAdministrator={isAdministrator}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          isSystemAdmin={isSystemAdmin}
          isAdministrator={isAdministrator}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
        />

        <OPCRDashboard
          role={role}
          operatingUnit={operatingUnit}
          focalship={focalship}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

      </div>
    )}

  </>
);
}
export default App;
