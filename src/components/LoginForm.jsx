function LoginForm({
  loginData,
  setLoginData,
  handleLogin,
  setShowLogin
}) {
  return (
    <form onSubmit={handleLogin} className="login-form">

      <h3>Login</h3>

      <input
        type="text"
        autoComplete="username"
        placeholder="Username"
        value={loginData.username}
        onChange={(e) =>
  setLoginData((prev) => ({
    ...prev,
    username: e.target.value
  }))
}
      />

      <input
        type="password"
        autoComplete="current-password"
        placeholder="Password"
        value={loginData.password}
        onChange={(e) =>
  setLoginData((prev) => ({
    ...prev,
    password: e.target.value
  }))
}
      />

      <div className="login-buttons">

        <button
          type="submit"
          className="login-btn"
        >
          Login
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={() => setShowLogin(false)}
        >
          Cancel
        </button>

      </div>

    </form>
  );
}

export default LoginForm;