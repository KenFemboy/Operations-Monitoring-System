import { useContext } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./auth/context/AuthContext";
import { BranchProvider } from "./features/shared/store/branchContext";
import { getHomeRouteByRole } from "./auth/utils/roleRoutes";




import Login from "./auth/pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DashboardLayout from "./layouts/DashboardLayout";

import {
  
  BranchesPage as SuperadminBranchesPage,
  BranchUsersPage as SuperadminBranchUsersPage,
  DashboardPage as SuperadminDashboardPage,
  EmployeesPage as SuperadminEmployeesPage,
  AttendancePage as SuperadminAttendancePage,

} from "./features/superadmin/pages";

// Protect private routes
function ProtectedRoute({ children, allowedRoles }) {
  const { loading, isAuthenticated, user } = useContext(AuthContext);

  if (loading) return <p style={{ padding: 24 }}>Checking session...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getHomeRouteByRole(user)} replace />;
  }

  return children;
}

// Prevent logged-in users from accessing login
function PublicOnlyRoute({ children }) {
  const { loading, isAuthenticated, user } = useContext(AuthContext);

  if (loading) return <p style={{ padding: 24 }}>Checking session...</p>;

  if (isAuthenticated) {
    return <Navigate to={getHomeRouteByRole(user)} replace />;
  }

  return children;
}

// Redirect after login based on role
function RoleRedirect() {
  const { user } = useContext(AuthContext);
  return <Navigate to={getHomeRouteByRole(user)} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Public */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Super Admin */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "superadmin"]}>
                <BranchProvider>
                  <DashboardLayout />
                </BranchProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperadminDashboardPage />} />
            <Route path="branches" element={<SuperadminBranchesPage />} />
            <Route path="branches/users" element={<SuperadminBranchUsersPage />} />
            <Route path="employees" element={<SuperadminEmployeesPage />} />
            <Route path="attendance" element={<SuperadminAttendancePage />} />
          
          </Route>

          {/* Backward compatible entry */}
          <Route
            path="/superadmin-dashboard"
            element={<Navigate to="/superadmin/dashboard" replace />}
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}