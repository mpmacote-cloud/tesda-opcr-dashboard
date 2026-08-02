function UserMenu({
  isSystemAdmin,
  isAdministrator,
  handleLogout
}) {
  const roleLabel = isSystemAdmin
    ? "System Administrator"
    : isAdministrator
    ? "Administrator"
    : "User";

  return (
    <div className="user-menu">

      <div
        className="user-button"
        aria-haspopup="true"
        aria-label="User menu"
      >
        👤

        <span>{roleLabel}</span>

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
  );
}

export default UserMenu;