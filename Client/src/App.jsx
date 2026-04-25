import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./features/shared/components/Navbar";
import Sidebar from "./features/shared/components/Sidebar";
import {
  DashboardPage,
  AttendancePage,
  EmployeesPage,
  BranchesPage,
  InventoryPage,
  SalesPage,
  FeedbackPage,
  IncidentsPage,
  NtePage,
  PlantillaPage,
  ContributionsPage,
  LeavesPage,
  ReportsPage,
  BranchUsersPage,
} from "./features/superadmin/pages";
import { BranchProvider, useBranchContext } from "./features/shared/store/branchContext";
import { adminNavigationItems } from "./features/shared/utils/adminNavigation";
import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage";
import AdminEmployeesPage from "./features/admin/pages/AdminEmployeesPage";
import AdminInventoryPage from "./features/admin/pages/AdminInventoryPage";
import AdminSalesPage from "./features/admin/pages/AdminSalesPage";
import AdminAttendancePage from "./features/admin/pages/AdminAttendancePage";
import AdminFeedbackPage from "./features/admin/pages/AdminFeedbackPage";
import AdminIncidentsPage from "./features/admin/pages/AdminIncidentsPage";
import AdminNtePage from "./features/admin/pages/AdminNtePage";
import AdminPlantillaPage from "./features/admin/pages/AdminPlantillaPage";
import AdminContributionsPage from "./features/admin/pages/AdminContributionsPage";
import AdminLeavesPage from "./features/admin/pages/AdminLeavesPage";

const getHomeRouteByRole = (user) =>
  user?.role === "admin" ? "/admin-dashboard" : "/dashboard";

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

function SuperAdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { activeBranch } = useBranchContext();
  const branchThemeClass = `theme-${activeBranch.toLowerCase().replace(/\s+/g, "-")}`;

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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AdminLayoutShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { activeBranch } = useBranchContext();
  const branchThemeClass = `theme-${activeBranch.toLowerCase().replace(/\s+/g, "-")}`;

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={`app-shell ${branchThemeClass}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        onNavigate={() => setIsSidebarOpen(false)}
        title="Ally's Admin"
        items={adminNavigationItems}
      />
      <div className="main-shell">
        <Navbar onToggleSidebar={() => setIsSidebarOpen((current) => !current)} isAdmin />
        <main className="page-content" key={`${location.pathname}-${activeBranch}`}>
          <Routes>
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin-employees" element={<AdminEmployeesPage />} />
            <Route path="/admin-inventory" element={<AdminInventoryPage />} />
            <Route path="/admin-sales" element={<AdminSalesPage />} />
            <Route path="/admin-attendance" element={<AdminAttendancePage />} />
            <Route path="/admin-feedback" element={<AdminFeedbackPage />} />
            <Route path="/admin-incidents" element={<AdminIncidentsPage />} />
            <Route path="/admin-nte" element={<AdminNtePage />} />
            <Route path="/admin-plantilla" element={<AdminPlantillaPage />} />
            <Route path="/admin-contributions" element={<AdminContributionsPage />} />
            <Route path="/admin-leaves" element={<AdminLeavesPage />} />
            <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
            <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AdminLayout() {
  const { user } = useContext(AuthContext);

  return (
    <BranchProvider lockedBranch={user?.branch || "Tagum City"} forceReadOnly={false}>
      <AdminLayoutShell />
    </BranchProvider>
  );
}

function RoleBasedLayout() {
  const { user } = useContext(AuthContext);

  if (user?.role === "admin") {
    return <AdminLayout />;
  }

  return (
    <BranchProvider>
      <SuperAdminLayout />
    </BranchProvider>
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
          <Route path="/register" element={<Navigate to="/login" replace />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <RoleBasedLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
