import { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <p>Not logged in</p>;

  return (
     <>
    <h1>Dashboard</h1>

    {user.role === "superadmin" && (
      <SuperAdminPanel />
    )}

    {user.role === "admin" && (
      <AdminPanel />
    )}
  </>
  );
}