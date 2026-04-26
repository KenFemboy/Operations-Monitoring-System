export default function TopNavbar({ title, user, onToggleSidebar, onLogout }) {
  return (
    <header className="sd-navbar">
      <div className="sd-navbar-left">
        <button
          type="button"
          className="sd-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          Menu
        </button>

        <div>
          <p className="sd-navbar-label">Operations Console</p>
          <h2 className="sd-navbar-title">{title}</h2>
        </div>
      </div>

      <div className="sd-navbar-right">
        <p className="sd-user-name">{user?.name || "User"}</p>
        <button type="button" className="sd-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
