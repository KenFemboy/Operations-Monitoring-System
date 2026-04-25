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
      const loggedInUser = res.data?.user;

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
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
    const loggedInUser = res.data?.user;

    if (!token || !loggedInUser) {
      throw new Error("Invalid login response from server");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return loggedInUser;
  };

  const loginAsSuperAdmin = async (password) => {
    const res = await api.post("/auth/temp-superadmin-login", { password });
    const token = res.data?.token;
    const loggedInUser = res.data?.user;

    if (!token || !loggedInUser) {
      throw new Error("Invalid login response from server");
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

  const isAuthenticated = Boolean(localStorage.getItem("token") && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginAsSuperAdmin,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}