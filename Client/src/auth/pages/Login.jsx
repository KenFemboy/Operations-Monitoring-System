import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getHomeRouteByRole } from "../utils/roleRoutes";
import "./Login.css";

const emptyLoginForm = {
  identifier: "",
  password: "",
};

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyLoginForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Always start login with blank credentials, including after logout redirects.
    setForm(emptyLoginForm);
    setError("");
    setShowPassword(false);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.identifier || !form.password) {
      setError("Please enter your email/username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loggedInUser = await login(form.identifier, form.password);
      navigate(getHomeRouteByRole(loggedInUser), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">A</div>
        <h1>Ally&apos;s Management System</h1>
        <p>Sign in to continue to your operations dashboard.</p>

        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          <label htmlFor="identifier">Username / Email</label>
          <input
            id="identifier"
            name="loginIdentifier"
            type="text"
            placeholder="admin@ally.com"
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            value={form.identifier}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
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
              autoComplete="new-password"
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
        </form>
      </div>
    </div>
  );
}