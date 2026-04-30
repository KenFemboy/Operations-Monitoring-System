import { useState } from "react";
import { getInventoryRecords } from "../api/inventoryApi";

function InventoryRecordsFilter({ onRecordsLoaded }) {
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    type: "all",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!filter.startDate || !filter.endDate) {
        alert("Please select start date and end date");
        return;
      }

      const startDate = `${filter.startDate}T00:00:00`;
      const endDate = `${filter.endDate}T23:59:59`;

      const res = await getInventoryRecords(startDate, endDate, filter.type);

      onRecordsLoaded(res.data.records || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch inventory records");
    }
  };

  return (
    <div style={styles.card}>
      <h2>Inventory Records</h2>
      <p>Filter stock in and stock out records by date and type.</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) =>
              setFilter({ ...filter, startDate: e.target.value })
            }
            required
            style={styles.input}
          />
        </div>

        <div>
          <label>End Date</label>
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) =>
              setFilter({ ...filter, endDate: e.target.value })
            }
            required
            style={styles.input}
          />
        </div>

        <div>
          <label>Record Type</label>
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            style={styles.input}
          >
            <option value="all">All Records</option>
            <option value="stock-in">Stock In Only</option>
            <option value="stock-out">Stock Out Only</option>
          </select>
        </div>

        <button type="submit" style={styles.primaryButton}>
          Show Records
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
  primaryButton: {
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default InventoryRecordsFilter;