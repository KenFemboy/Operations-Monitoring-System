import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOAD USER ON REFRESH
  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.log("AUTH ME FAILED:", err.response?.data || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}