import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import RegisterUser from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./features/shared/components/Navbar";
import Sidebar from "./features/shared/components/Sidebar";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import AttendancePage from "./features/attendance/pages/AttendancePage";
import EmployeesPage from "./features/employees/pages/EmployeesPage";
import BranchesPage from "./features/branches/pages/BranchesPage";
import InventoryPage from "./features/inventory/pages/InventoryPage";
import SalesPage from "./features/sales/pages/SalesPage";
import FeedbackPage from "./features/feedback/pages/FeedbackPage";
import IncidentsPage from "./features/incidents/pages/IncidentsPage";
import NtePage from "./features/nte/pages/NtePage";
import PlantillaPage from "./features/plantilla/pages/PlantillaPage";
import ContributionsPage from "./features/contributions/pages/ContributionsPage";
import LeavesPage from "./features/leaves/pages/LeavesPage";
import ReportsPage from "./features/reports/pages/ReportsPage";
import BranchUsersPage from "./features/branches/pages/BranchUsersPage";
import { BranchProvider, useBranchContext } from "./features/shared/store/branchContext";

const getHomeRouteByRole = (user) =>
  user?.role === "super_admin" ? "/super-admin-dashboard" : "/dashboard";

function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return <p style={{ padding: 24 }}>Checking session...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { loading, isAuthenticated, user } = useContext(AuthContext);

  if (loading) {
    return <p style={{ padding: 24 }}>Checking session...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to={getHomeRouteByRole(user)} replace />;
  }

  return children;
}

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { activeBranch } = useBranchContext();
  const { user } = useContext(AuthContext);
  const branchThemeClass = `theme-${activeBranch.toLowerCase().replace(/\s+/g, "-")}`;
  const homeRoute = getHomeRouteByRole(user);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={`app-shell ${branchThemeClass}`}>
      <Sidebar isOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />
      <div className="main-shell">
        <Navbar onToggleSidebar={() => setIsSidebarOpen((current) => !current)} />
        <main className="page-content" key={`${location.pathname}-${activeBranch}`}>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/super-admin-dashboard" element={<DashboardPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/branches/users" element={<BranchUsersPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/nte" element={<NtePage />} />
            <Route path="/plantilla" element={<PlantillaPage />} />
            <Route path="/contributions" element={<ContributionsPage />} />
            <Route path="/leaves" element={<LeavesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/" element={<Navigate to={homeRoute} replace />} />
            <Route path="*" element={<Navigate to={homeRoute} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route path="/register" element={<RegisterUser />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <BranchProvider>
                  <AppLayout />
                </BranchProvider>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}