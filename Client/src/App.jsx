import { useContext } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./auth/context/AuthContext";
import { BranchProvider } from "./features/shared/store/branchContext";
import { getHomeRoute } from "./auth/utils/appRoutes";

import Login from "./auth/pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";

import DashboardPage from "./features/dashboard/pages/DashboardPage";
import BranchesPage from "./features/branches/pages/BranchesPage";
import BranchUsersPage from "./features/branches/pages/BranchUsersPage";
import EmployeesPage from "./features/employees/pages/EmployeesPage";
import PlantillaPage from "./features/plantilla/pages/PlantillaPage";
import AttendancePage from "./features/attendance/pages/AttendancePage";
import LeavesPage from "./features/leaves/pages/LeavesPage";
import InventoryPage from "./features/inventory/pages/InventoryPage";
import SalesPage from "./features/sales/pages/SalesPage";
import FeedbackPage from "./features/feedback/pages/FeedbackPage";
import IncidentsPage from "./features/incidents/pages/IncidentsPage";
import NtePage from "./features/nte/pages/NtePage";
import PayrollPage from "./features/payroll/pages/PayrollPage";
import ContributionsPage from "./features/contributions/pages/ContributionsPage";
import ReportsPage from "./features/reports/pages/ReportsPage";
import SettingsPage from "./features/settings/pages/SettingsPage";

// Protect private routes
function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useContext(AuthContext);

  if (loading) return <p style={{ padding: 24 }}>Checking session...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

// Prevent logged-in users from accessing login
function PublicOnlyRoute({ children }) {
  const { loading, isAuthenticated } = useContext(AuthContext);

  if (loading) return <p style={{ padding: 24 }}>Checking session...</p>;

  if (isAuthenticated) {
    return <Navigate to={getHomeRoute()} replace />;
  }

  return children;
}

function AppRedirect() {
  return <Navigate to={getHomeRoute()} replace />;
}

function LegacyAppRedirect() {
  const { "*": splat = "dashboard" } = useParams();
  return <Navigate to={`/app/${splat || "dashboard"}`} replace />;
}

function LegacyAdminRedirect() {
  const { legacyPage = "dashboard" } = useParams();
  return <Navigate to={`/app/${legacyPage}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default */}
          <Route path="/" element={<AppRedirect />} />

          {/* Public */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          {/* Unified app */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <BranchProvider>
                  <DashboardLayout />
                </BranchProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="branches" element={<BranchesPage />} />
            <Route path="branches/users" element={<BranchUsersPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="plantilla" element={<PlantillaPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="leaves" element={<LeavesPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="incidents" element={<IncidentsPage />} />
            <Route path="nte" element={<NtePage />} />
            <Route path="payroll" element={<PayrollPage />} />
            <Route path="contributions" element={<ContributionsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Backward compatible entries */}
          <Route
            path="/admin-dashboard"
            element={<Navigate to="/app/dashboard" replace />}
          />
          <Route
            path="/admin-:legacyPage"
            element={<LegacyAdminRedirect />}
          />
          <Route
            path="/superadmin-dashboard"
            element={<Navigate to="/app/dashboard" replace />}
          />
          <Route
            path="/superadmin/*"
            element={<LegacyAppRedirect />}
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
