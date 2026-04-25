import { useContext } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";




import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./admin/AdminDashboard";
import SuperAdminDashboard from "./adminSuper/SuperAdminDashboard";

const getHomeRouteByRole = (user) => {
  if (user?.role === "super_admin") return "/superadmin-dashboard";
  if (user?.role === "admin") return "/admin-dashboard";
  return "/"; // safe fallback
};

// Protect private routes
function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useContext(AuthContext);

  if (loading) return <p style={{ padding: 24 }}>Checking session...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

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
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Super Admin */}
          <Route
            path="/superadmin-dashboard"
            element={
              <ProtectedRoute>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}