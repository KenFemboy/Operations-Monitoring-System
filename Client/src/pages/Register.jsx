import { useEffect, useState } from "react";
import api from "../api/axios";

export default function RegisterUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales",
    branchId: "",
  });

  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

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

    try {
      await api.post("/auth/register", form);
      alert("User created successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Create User</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          length="6"
          onChange={handleChange}
        />

        <select name="role" onChange={handleChange} value={form.role}>
          <option value="sales">Sales</option>
          <option value="hr">HR</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>

        {/* ✅ Branch dropdown (only if NOT super admin) */}
        {form.role !== "super_admin" && (
          <select
            name="branchId"
            onChange={handleChange}
            value={form.branchId}
            disabled={loadingBranches}
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
        )}

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}