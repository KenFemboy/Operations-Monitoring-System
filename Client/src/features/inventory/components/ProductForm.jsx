import { useContext, useEffect, useState } from "react";
import { createProduct } from "../../../api/admin/adminInventoryApi";
import { getBranches } from "../../../api/admin/adminBranchApi";
import { AuthContext } from "../../../auth/context/AuthContext";

function ProductForm({ onRefresh, branchId = "" }) {
  const { user } = useContext(AuthContext);
  const isSuperAdmin = ["super_admin", "superadmin"].includes(
    (user?.role || "").toLowerCase()
  );
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "",
    minimumStock: "",
    branchId,
  });

  const handleMinimumStockChange = (value) => {
    const nextValue = Number(value) < 0 ? "0" : value;
    setForm({ ...form, minimumStock: nextValue });
  };

  useEffect(() => {
    if (!isSuperAdmin) return;

    const loadBranches = async () => {
      try {
        const response = await getBranches();
        setBranches(response.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadBranches();
  }, [isSuperAdmin]);

  useEffect(() => {
    if (!branchId) return;

    setForm((current) => ({
      ...current,
      branchId,
    }));
  }, [branchId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const minimumStock = Number(form.minimumStock);

    try {
      await createProduct({
        ...form,
        branchId: branchId || form.branchId,
        minimumStock,
      });

      setForm({
        name: "",
        category: "",
        unit: "",
        minimumStock: "",
        branchId,
      });

      onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <div style={styles.card}>
      <h2>Create Product</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Unit e.g. kg, sack, pcs"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          required
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Minimum Stock"
          value={form.minimumStock}
          min="0"
          onChange={(e) => handleMinimumStockChange(e.target.value)}
          required
          style={styles.input}
        />

        {isSuperAdmin && !branchId && (
          <select
            value={form.branchId}
            onChange={(e) => setForm({ ...form, branchId: e.target.value })}
            required
            style={styles.input}
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.branchName} - {branch.location}
              </option>
            ))}
          </select>
        )}

        <button type="submit" style={styles.primaryButton}>
          Add Product
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  primaryButton: {
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ProductForm;
