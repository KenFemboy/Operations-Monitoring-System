import { useContext, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/context/AuthContext";
import Sidebar from "../components/appShell/Sidebar";
import TopNavbar from "../components/appShell/TopNavbar";
import "../styles/app-shell.css";

const routeTitles = {
  dashboard: "Dashboard",
  reports: "Reports",
  branches: "Branches",
  users: "Branch Users",
  employees: "Employees",
  inventory: "Inventory",
  sales: "Sales",
  attendance: "Attendance",
  feedback: "Feedback",
  incidents: "Incidents",
  nte: "NTE Monitoring",
  plantilla: "Plantilla",
  payroll: "Payroll",
  contributions: "Contributions",
  leaves: "Leaves",
  settings: "Settings",
  archive: "Archive",
};

const getPageTitle = (pathname) => {
  const parts = pathname.split("/").filter(Boolean);
  const maybeLeaf = parts[parts.length - 1];
  return routeTitles[maybeLeaf] || "Dashboard";
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
