import { createContext, useEffect, useState } from "react";
import api from "../../api/axios";

export const AuthContext = createContext();

const parseStoredUser = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(parseStoredUser);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (userData) => {
    if (!userData) return null;

    return {
      ...userData,
      role: userData.role,
      branchId: userData.branchId || null,
      branchName: userData.branchName || userData.branch || null,
      branchLocation: userData.branchLocation || null,
      branchAddress: userData.branchAddress || null,
    };
  };

  // LOAD USER ON REFRESH
  const fetchMe = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      const loggedInUser = normalizeUser(res.data?.user);

      if (!loggedInUser) {
        throw new Error("Invalid /auth/me response");
      }

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    } catch (err) {
      console.log("AUTH ME FAILED:", err.response?.data || err.message);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  // LOGIN
  const login = async (identifier, password) => {
    const res = await api.post("/auth/login", {
      email: identifier,
      username: identifier,
      password,
    });

    const token = res.data?.token;
    const loggedInUser = normalizeUser(res.data?.user);

    if (!token || !loggedInUser) {
      throw new Error("Invalid login response from server");
    }

    // Only branch users must have a branch.
    // Super admin is allowed to have branchId: null.
    if (loggedInUser.role === "console_user" && !loggedInUser.branchId) {
      throw new Error("This user has no assigned branch.");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return loggedInUser;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = Boolean(user && localStorage.getItem("token"));

  const isSuperAdmin = user?.role === "super_admin";
  const isConsoleUser = user?.role === "console_user";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated,
        isSuperAdmin,
        isConsoleUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}