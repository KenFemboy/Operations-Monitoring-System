import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const getHomeRouteByRole = (user) =>
  user?.role === "super_admin" ? "/super-admin-dashboard" : "/dashboard";

export default function Login() {
  const { login, loginAsSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [superAdminLoading, setSuperAdminLoading] = useState(false);
  const [superAdminPassword, setSuperAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loggedInUser = await login(form.email, form.password);
      navigate(getHomeRouteByRole(loggedInUser), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSuperAdminLogin = async () => {
    if (!superAdminPassword) {
      setError("Please enter the super admin password.");
      return;
    }

    setSuperAdminLoading(true);
    setError("");

    try {
      const loggedInUser = await loginAsSuperAdmin(superAdminPassword);
      navigate(getHomeRouteByRole(loggedInUser), { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Super admin login failed"
      );
    } finally {
      setSuperAdminLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">A</div>
        <h1>Ally&apos;s Management System</h1>
        <p>Sign in to continue to your operations dashboard.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Email / Username</label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="you@example.com"
            onChange={handleChange}
            value={form.email}
            autoComplete="username"
          />

          <label htmlFor="password">Password</label>
          <div className="password-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={handleChange}
              value={form.password}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error ? <div className="login-error">{error}</div> : null}

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <label htmlFor="superAdminPassword">Super Admin Password</label>
          <input
            id="superAdminPassword"
            name="superAdminPassword"
            type="password"
            placeholder="Enter super admin password"
            value={superAdminPassword}
            onChange={(e) => setSuperAdminPassword(e.target.value)}
            autoComplete="off"
          />

          <button
            className="super-admin-submit"
            type="button"
            disabled={superAdminLoading}
            onClick={handleSuperAdminLogin}
          >
            {superAdminLoading ? "Signing in super admin..." : "Login as Super Admin"}
          </button>

          <p className="temp-note">
            Temporary super admin password: <strong>12345678</strong>
          </p>

          <p className="create-account-text">
            Need an account? <Link to="/register">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}