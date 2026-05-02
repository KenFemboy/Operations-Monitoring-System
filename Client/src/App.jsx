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

//  Under sa Employees Page: Employees Attendance Payroll Leave Contributions Incident Reports NTE 
import EmployeesPage from "./employees/pages/EmployeesPage";


import PlantillaPage from "./plantilla/pages/PlantillaPage";


import InventoryPage from "./inventory/pages/InventoryPage";

import SalesPage from "./sales/pages/SalesPage";


import FeedbackPage from "./features/feedback/pages/FeedbackPage";
import ReportsPage from "./features/reports/pages/ReportsPage";
import SettingsPage from "./features/settings/pages/SettingsPage";
import ArchivePage from "./features/settings/pages/ArchivePage";


import CustomerFeedbackPage from "./feedback/pages/CustomerFeedbackPage";
import AdminFeedbackPage from "./feedback/pages/AdminFeedbackPage";
//  Protect private routes
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

          <Route path="/feedback" element={<CustomerFeedbackPage />} />


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


            {/* Employee Page */}
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="attendance" element={<EmployeesPage initialTab="attendance" />} />
            <Route path="leave" element={<EmployeesPage initialTab="leave" />} />
            <Route path="payroll" element={<EmployeesPage initialTab="payroll" />} />
            <Route path="contributions" element={<EmployeesPage initialTab="contribution" />} />
            <Route path="incident-reports" element={<EmployeesPage initialTab="ir" />} />
            <Route path="nte" element={<EmployeesPage initialTab="nte" />} />



            <Route path="plantilla" element={<PlantillaPage />} />

            <Route path="inventory" element={<InventoryPage />} />

            <Route path="sales" element={<SalesPage />} />

          <Route path="feedback" element={<AdminFeedbackPage /> } /> 



            <Route path="settings" element={<SettingsPage />} />
            <Route path="settings/archive" element={<ArchivePage />} />
          </Route>

          <Route path="/employees" element={<Navigate to="/app/employees" replace />} />
          <Route path="/plantilla" element={<Navigate to="/app/plantilla" replace />} />
          <Route path="/attendance" element={<Navigate to="/app/attendance" replace />} />
          
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

