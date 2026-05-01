import { useState } from "react";
import { createSale } from "../api/salesApi";

function SaleForm({ onRefresh }) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    saleDate: today,
    serviceType: "lunch",
    customerName: "",
    customerType: "adult",
    isSenior: false,
    isPWD: false,
    remarks: "",
  });

  const calculatePreview = () => {
    let basePrice = 0;

    if (form.customerType === "kid") {
      basePrice = 0;
    }

    if (form.customerType === "adultUnder4ft") {
      basePrice = 150;
    }

    if (form.customerType === "adult") {
      basePrice = 299;
    }

    const discount = basePrice > 0 && (form.isSenior || form.isPWD) ? 50 : 0;
    const total = Math.max(basePrice - discount, 0);

    return {
      basePrice,
      discount,
      total,
    };
  };

  const preview = calculatePreview();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createSale(form);

      alert("Sale recorded successfully");

      setForm({
        saleDate: today,
        serviceType: "lunch",
        customerName: "",
        customerType: "adult",
        isSenior: false,
        isPWD: false,
        remarks: "",
      });

      onRefresh();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to record sale");
    }
  };

  return (
    <div style={styles.card}>
      <h2>Record Buffet Sale</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label>Date</label>
          <input
            type="date"
            value={form.saleDate}
            onChange={(e) => setForm({ ...form, saleDate: e.target.value })}
            required
            style={styles.input}
          />
        </div>

        <div>
          <label>Service</label>
          <select
            value={form.serviceType}
            onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
            required
            style={styles.input}
          >
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>

        <div>
          <label>Customer Name</label>
          <input
            type="text"
            placeholder="Optional"
            value={form.customerName}
            onChange={(e) =>
              setForm({ ...form, customerName: e.target.value })
            }
            style={styles.input}
          />
        </div>

        <div>
          <label>Customer Type</label>
          <select
            value={form.customerType}
            onChange={(e) =>
              setForm({
                ...form,
                customerType: e.target.value,
                isSenior:
                  e.target.value === "kid" ||
                  e.target.value === "adultUnder4ft"
                    ? false
                    : form.isSenior,
                isPWD:
                  e.target.value === "kid" ||
                  e.target.value === "adultUnder4ft"
                    ? false
                    : form.isPWD,
              })
            }
            required
            style={styles.input}
          >
            <option value="kid">Kid / Children - Free</option>
            <option value="adultUnder4ft">Adult under 4ft - ₱150</option>
            <option value="adult">Adult - ₱299</option>
          </select>
        </div>

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={form.isSenior}
            disabled={form.customerType !== "adult"}
            onChange={(e) => setForm({ ...form, isSenior: e.target.checked })}
          />
          Senior Citizen
        </label>

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={form.isPWD}
            disabled={form.customerType !== "adult"}
            onChange={(e) => setForm({ ...form, isPWD: e.target.checked })}
          />
          PWD
        </label>

        <div>
          <label>Remarks</label>
          <input
            type="text"
            placeholder="Optional"
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            style={styles.input}
          />
        </div>

        <div style={styles.previewBox}>
          <p>Base Price: ₱{preview.basePrice}</p>
          <p>Discount: ₱{preview.discount}</p>
          <h3>Total: ₱{preview.total}</h3>
        </div>

        <button type="submit" style={styles.primaryButton}>
          Save Sale
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
    alignItems: "end",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginTop: "6px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingBottom: "10px",
  },
  previewBox: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "12px",
  },
  primaryButton: {
    padding: "12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default SaleForm;