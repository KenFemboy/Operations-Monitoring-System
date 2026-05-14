import { useState } from "react";
import { createStockIn } from "../../../api/admin/adminInventoryApi";

function StockInForm({ products, onRefresh }) {
  const [form, setForm] = useState({
    product: "",
    quantity: "",
    reason: "Purchase",
    remarks: "",
  });

  const handleQuantityChange = (value) => {
    const nextValue = Number(value) < 0 ? "0" : value;
    setForm({ ...form, quantity: nextValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quantity = Number(form.quantity);

    if (quantity <= 0) {
      alert("Quantity must be greater than zero");
      return;
    }

    try {
      await createStockIn({
        ...form,
        quantity,
      });

      setForm({
        product: "",
        quantity: "",
        reason: "Purchase",
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
          min="0"
          onChange={(e) => handleQuantityChange(e.target.value)}
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
