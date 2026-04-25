import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SuperAdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <p>Not logged in</p>;

  return (
    <div>
      <h2>Welcome {user.name}</h2>

      <p>Role: {user.role}</p>

      <p>
        Branch: {user.branchId
          ? `${user.branchId.branchName} - ${user.branchId.location}`
          : "ALL"}
      </p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}