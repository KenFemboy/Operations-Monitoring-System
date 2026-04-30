import { useState } from "react";
import { createStockIn } from "../api/inventoryApi";

function StockInForm({ products, onRefresh }) {
  const [form, setForm] = useState({
    product: "",
    quantity: "",
    reason: "Purchase",
    addedBy: "Admin",
    remarks: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createStockIn({
        ...form,
        quantity: Number(form.quantity),
      });

      setForm({
        product: "",
        quantity: "",
        reason: "Purchase",
        addedBy: "Admin",
        remarks: "",
      });

      onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to stock in");
    }
  };

  return (
    <div style={styles.card}>
      <h2>Stock In</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <select
          value={form.product}
          onChange={(e) => setForm({ ...form, product: e.target.value })}
          required
          style={styles.input}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
          style={styles.input}
        />

        <select
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          style={styles.input}
        >
          <option value="Purchase">Purchase</option>
          <option value="Return">Return</option>
          <option value="Adjustment">Adjustment</option>
          <option value="Opening Stock">Opening Stock</option>
        </select>

        <input
          type="text"
          placeholder="Added By"
          value={form.addedBy}
          onChange={(e) => setForm({ ...form, addedBy: e.target.value })}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Remarks"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          style={styles.input}
        />

        <button type="submit" style={styles.primaryButton}>
          Add Stock
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

export default StockInForm;