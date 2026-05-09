import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../../auth/pages/Login";
import Unauthorized from "../../auth/pages/Unauthorized";
import RoleRoute from "../../auth/components/RoleRoute";
import { AuthContext } from "../../auth/context/AuthContext";
import { getHomeRoute } from "../../auth/utils/appRoutes";
import { BranchProvider } from "../../shared/store/branchContext";
import AdminRoutes from "./AdminRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import PublicRoutes from "./PublicRoutes";

function PublicOnlyRoute({ children }) {
  const { loading, isAuthenticated } = useContext(AuthContext);

  if (loading) return <p style={{ padding: 24 }}>Checking session...</p>;
  if (isAuthenticated) return <Navigate to={getHomeRoute()} replace />;

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />
      <Route path="/feedback/*" element={<PublicRoutes />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/admin/*"
        element={
          <RoleRoute allowedRoles={["admin", "console_user"]}>
            <BranchProvider>
              <AdminRoutes />
            </BranchProvider>
          </RoleRoute>
        }
      />
      <Route
        path="/superadmin/*"
        element={
          <RoleRoute allowedRoles={["superadmin", "super_admin"]}>
            <BranchProvider>
              <SuperAdminRoutes />
            </BranchProvider>
          </RoleRoute>
        }
      />
      <Route path="/super_admin/*" element={<Navigate to="/superadmin/dashboard" replace />} />
      <Route path="/app/*" element={<Navigate to={getHomeRoute()} replace />} />
      <Route path="/employees" element={<Navigate to="/admin/employees" replace />} />
      <Route path="/plantilla" element={<Navigate to="/admin/plantilla" replace />} />
      <Route path="/attendance" element={<Navigate to="/admin/attendance" replace />} />
      <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/superadmin-dashboard" element={<Navigate to="/superadmin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
