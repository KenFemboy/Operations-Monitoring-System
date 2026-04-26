import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./Register.css";

export default function RegisterUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales",
    branchId: "",
  });

  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Fetch branches on mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await api.get("/branches/get-all");
        setBranches(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load branches", err);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      await api.post("/auth/register", form);
      setMessage("User created successfully. Redirecting to login...");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "sales",
        branchId: "",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-logo">A</div>
        <h1>Create User Account</h1>
        <p>Add a new staff account for Ally&apos;s Management System.</p>

        <form onSubmit={handleSubmit} className="register-form">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            placeholder="Juan Dela Cruz"
            onChange={handleChange}
            value={form.name}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="user@ally.com"
            onChange={handleChange}
            value={form.email}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="register-password-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              required
              minLength={6}
              onChange={handleChange}
              value={form.password}
            />
            <button
              type="button"
              className="register-password-toggle"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            onChange={handleChange}
            value={form.role}
          >
            <option value="sales">Sales</option>
            <option value="hr">HR</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>

          {form.role !== "super_admin" && (
            <>
              <label htmlFor="branchId">Branch</label>
              <select
                id="branchId"
                name="branchId"
                onChange={handleChange}
                value={form.branchId}
                disabled={loadingBranches}
                required
              >
                <option value="">
                  {loadingBranches ? "Loading branches..." : "Select Branch"}
                </option>

                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
            </>
          )}

          {error ? <div className="register-error">{error}</div> : null}
          {message ? <div className="register-success">{message}</div> : null}

          <button type="submit" className="register-submit" disabled={submitting}>
            {submitting ? "Creating user..." : "Create User"}
          </button>

          <p className="register-footer">
            Already have access? <Link to="/login">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}