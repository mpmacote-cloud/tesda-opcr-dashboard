import DesktopMenu from "./DesktopMenu";

function Navbar({
  isSystemAdmin,
  isAdministrator,
  setActiveTab,
  handleLogout,
  mobileMenuOpen,
  setMobileMenuOpen
}) {
  return (
    <div className="navbar">

      <div className="nav-left">
  <img
    src="/tesda-logo.png"
    alt="TESDA Logo"
    className="nav-logo"
  />

  <div className="nav-title">
    <h3>TESDA Bukidnon</h3>
    <span className="nav-subtitle">
      Performance Management Information System
    </span>
  </div>
</div>
      <div className="nav-right">

        <DesktopMenu
          isSystemAdmin={isSystemAdmin}
          isAdministrator={isAdministrator}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
        />

        {/* Mobile Hamburger */}
        <button
          className="hamburger"
           aria-label="Toggle navigation menu"
           aria-expanded={mobileMenuOpen}
          onClick={() =>
  setMobileMenuOpen((prev) => !prev)
}
        >
          ☰
        </button>

      </div>

    </div>
  );
}

export default Navbar;