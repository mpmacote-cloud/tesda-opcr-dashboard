import { useState, useEffect } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Default users if none exist
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [
      { username: "admin", password: "nimda", role: "admin" },
      { username: "guest", password: "guest", role: "guest" }
    ];
    setUsers(savedUsers);
    localStorage.setItem("users", JSON.stringify(savedUsers));
  }, []);

  const handleLogin = e => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user.role);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={container}>
      <h2>Login to OPCR Dashboard</h2>
      <form onSubmit={handleLogin} style={formStyle}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

const container = { maxWidth: 400, margin: "100px auto", padding: 20, background: "white", borderRadius: 10, boxShadow: "0 2px 5px rgba(0,0,0,0.2)", textAlign: "center" };
const formStyle = { display: "flex", flexDirection: "column", gap: 10 };
const inputStyle = { padding: 10, borderRadius: 5, border: "1px solid #ccc" };
const buttonStyle = { padding: 10, borderRadius: 5, border: "none", backgroundColor: "#1976d2", color: "white", cursor: "pointer" };

export default Login;
