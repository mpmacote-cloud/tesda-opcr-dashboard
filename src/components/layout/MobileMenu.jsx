function MobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  isSystemAdmin,
  isAdministrator,
  setActiveTab,
  handleLogout
}) {
  if (!mobileMenuOpen) return null;

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const goTo = (tab) => {
    setActiveTab(tab);
    closeMenu();
  };

  return (
    <div className="mobile-menu">

      <div
        className="mobile-item"
        onClick={() => {
          closeMenu();
          window.location.reload();
        }}
      >
        🏠 Home
      </div>

      <div
        className="mobile-item"
        onClick={() => goTo("opcr")}
      >
        📊 OPCR Dashboard
      </div>

      {(isSystemAdmin || isAdministrator) && (
        <div
          className="mobile-item"
          onClick={() => goTo("users")}
        >
          👥 User Management
        </div>
      )}

      {isSystemAdmin && (
        <div
          className="mobile-item"
          onClick={() => goTo("masterData")}
        >
          🗂 Master Data
        </div>
      )}

      <div
        className="mobile-item"
        onClick={() => {
          // Future feature
          closeMenu();
          // setActiveTab("situationer");
        }}
      >
        📈 Bukidnon TVET Situationer
      </div>

      <div
        className="mobile-item"
        onClick={() => {
          closeMenu();
          handleLogout();
        }}
      >
        🚪 Logout
      </div>

    </div>
  );
}

export default MobileMenu;