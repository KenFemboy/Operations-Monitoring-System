import { useState } from "react";
import { createPurchase } from "../api/inventoryApi";

function PurchaseForm({ products, onRefresh }) {
  const [form, setForm] = useState({
    product: "",
    supplierName: "",
    quantity: "",
    unitCost: "",
    purchaseDate: "",
    remarks: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createPurchase({
        ...form,
        quantity: Number(form.quantity),
        unitCost: Number(form.unitCost),
      });

      setForm({
        product: "",
        supplierName: "",
        quantity: "",
        unitCost: "",
        purchaseDate: "",
        remarks: "",
      });

      onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create purchase");
    }
  };

  return (
    <div style={styles.card}>
      <h2>Create Purchase</h2>

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
          type="text"
          placeholder="Supplier Name"
          value={form.supplierName}
          onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
          required
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Unit Cost"
          value={form.unitCost}
          onChange={(e) => setForm({ ...form, unitCost: e.target.value })}
          required
          style={styles.input}
        />

        <input
          type="date"
          value={form.purchaseDate}
          onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
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
          Add Purchase
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

export default PurchaseForm;