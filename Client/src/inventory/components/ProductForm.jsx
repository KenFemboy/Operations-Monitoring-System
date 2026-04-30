import { useState } from "react";
import { createProduct } from "../api/inventoryApi";

function ProductForm({ onRefresh }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "",
    minimumStock: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct({
        ...form,
        minimumStock: Number(form.minimumStock),
      });

      setForm({
        name: "",
        category: "",
        unit: "",
        minimumStock: "",
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
          onChange={(e) =>
            setForm({ ...form, minimumStock: e.target.value })
          }
          required
          style={styles.input}
        />

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