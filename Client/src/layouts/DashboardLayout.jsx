import { useContext, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/context/AuthContext";
import Sidebar from "../components/superadmin/Sidebar";
import TopNavbar from "../components/superadmin/TopNavbar";
import "../styles/superadmin-dashboard.css";

const getPageTitle = (pathname) => {
  if (pathname.endsWith("/branches")) return "Branches";
  if (pathname.endsWith("/employees")) return "Employees";
  return "Dashboard";
};

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = useMemo(
    () => getPageTitle(location.pathname),
    [location.pathname],
  );

  return (
    <div className="sd-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPath={location.pathname}
      />

      <div className="sd-main">
        <TopNavbar
          title={pageTitle}
          user={user}
          onToggleSidebar={() => setSidebarOpen((current) => !current)}
          onLogout={logout}
        />

        <main className="sd-content" onClick={() => setSidebarOpen(false)}>
          <div key={location.pathname} className="sd-page-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
