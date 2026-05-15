import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RoleRoute({ allowedRoles = [], children }) {
  const { loading, user, isAuthenticated } = useContext(AuthContext);

  const normalize = (r) => {
    const normalized = (r || "").toString().trim().toLowerCase().replace(/[\s-]+/g, "_");
    if (normalized === "super_admin" || normalized === "superadmin") return "superadmin";
    if (normalized === "consoleuser" || normalized === "console_user") return "console_user";
    return normalized;
  };

  if (loading) return <p style={{ padding: 24 }}>Checking session...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const userRole = normalize(user?.role);
  const allowed = new Set(allowedRoles.map(normalize));

  if (!user || !allowed.has(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
