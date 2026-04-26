import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../auth/context/AuthContext";
import api from "../api/axios";
import "./AdminDashboard.css";

const initialForm = {
  branchName: "",
  location: "",
  address: "",
  description: "",
};

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [branch, setBranch] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const displayName = useMemo(() => {
    if (!user?.name) return "Admin";
    return user.name;
  }, [user?.name]);

  const syncFormWithBranch = (branchData) => {
    setForm({
      branchName: branchData?.branchName || "",
      location: branchData?.location || "",
      address: branchData?.address || "",
      description: branchData?.description || "",
    });
  };

  const loadMyBranch = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/branches/my-branch");
      const branchData = response.data?.data;

      if (!branchData) {
        setError("No branch data found for this admin account.");
        setBranch(null);
      } else {
        setBranch(branchData);
        syncFormWithBranch(branchData);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your branch details.");
      setBranch(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyBranch();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleReset = () => {
    setError("");
    setSuccess("");
    syncFormWithBranch(branch);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put("/branches/my-branch", form);
      const updatedBranch = response.data?.data;
      setBranch(updatedBranch || null);

      if (updatedBranch) {
        syncFormWithBranch(updatedBranch);
      }

      setSuccess(response.data?.message || "Your branch was updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save branch changes.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <p>Not logged in</p>;

  const branchSummary = branch?.branchName || user.branch || "Not assigned";

  return (
    <section className="admin-page">
      <header className="admin-hero">
        <div>
          <p className="admin-kicker">Admin Control Panel</p>
          <h1>Welcome back, {displayName}</h1>
          <p className="admin-subtitle">
            You can only edit your assigned branch. Cross-branch updates are restricted.
          </p>
        </div>
        <button type="button" className="admin-logout" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="admin-stats-grid" aria-label="Admin quick summary">
        <article className="admin-stat-card">
          <h2>Assigned Branch</h2>
          <p>{branchSummary}</p>
        </article>
        <article className="admin-stat-card">
          <h2>Role</h2>
          <p>{user.role}</p>
        </article>
      </section>

      <section className="admin-editor-card" aria-live="polite">
        <div className="admin-editor-header">
          <h2>Edit My Branch</h2>
          <p>Changes apply to your branch profile only.</p>
        </div>

        {loading ? <p className="admin-info">Loading branch details...</p> : null}
        {error ? <p className="admin-error">{error}</p> : null}
        {success ? <p className="admin-success">{success}</p> : null}

        <form className="admin-form" onSubmit={handleSubmit}>
          <label htmlFor="branchName">Branch Name</label>
          <input
            id="branchName"
            name="branchName"
            value={form.branchName}
            onChange={handleChange}
            disabled={loading || saving}
            required
          />

          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            disabled={loading || saving}
          />

          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            disabled={loading || saving}
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            disabled={loading || saving}
          />

          <div className="admin-form-actions">
            <button type="button" onClick={handleReset} disabled={loading || saving}>
              Reset
            </button>
            <button type="submit" disabled={loading || saving}>
              {saving ? "Saving..." : "Save Branch"}
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}