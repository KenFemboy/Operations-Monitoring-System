import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RoleRoute({ allowedRoles = [], children }) {
  const { loading, user, isAuthenticated } = useContext(AuthContext);

  const normalize = (r) => (r || "").toString().toLowerCase().replace(/[_\s]/g, "");

  if (loading) return <p style={{ padding: 24 }}>Checking session...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const userRole = normalize(user?.role);
  const allowed = new Set(allowedRoles.map(normalize));

  if (!user || !allowed.has(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
