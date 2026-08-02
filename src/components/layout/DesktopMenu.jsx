import UserMenu from "./UserMenu";

function DesktopMenu({
  isSystemAdmin,
  isAdministrator,
  setActiveTab,
  handleLogout
}) {
  const goTo = (tab) => {
    setActiveTab(tab);
  };

  return (
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

          <div onClick={() => goTo("opcr")}>
            OPCR Dashboard
          </div>

          {(isSystemAdmin || isAdministrator) && (
            <div onClick={() => goTo("users")}>
              User Management
            </div>
          )}

          {isSystemAdmin && (
            <div onClick={() => goTo("operatingUnits")}>
              Master Data
            </div>
          )}

          <div
            onClick={() => {
              // Future feature
              // goTo("situationer");
            }}
          >
            Bukidnon TVET Situationer
          </div>

        </div>

      </div>

      <UserMenu
        isSystemAdmin={isSystemAdmin}
        isAdministrator={isAdministrator}
        handleLogout={handleLogout}
      />

    </div>
  );
}

export default DesktopMenu;