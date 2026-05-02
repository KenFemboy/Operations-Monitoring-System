import { useState } from "react";

function FeedbackDateFilter({ onFilter, onClear }) {
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!filter.startDate || !filter.endDate) {
      alert("Please select start date and end date");
      return;
    }

    onFilter(filter.startDate, filter.endDate);
  };

  const handleClear = () => {
    setFilter({
      startDate: "",
      endDate: "",
    });

    onClear();
  };

  return (
    <div style={styles.card}>
      <h2>Filter Reviews by Date</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label style={styles.label}>Start Date</label>
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) =>
              setFilter({ ...filter, startDate: e.target.value })
            }
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>End Date</label>
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) =>
              setFilter({ ...filter, endDate: e.target.value })
            }
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.primaryButton}>
          Apply Filter
        </button>

        <button type="button" onClick={handleClear} style={styles.clearButton}>
          Clear
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
    marginTop: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    alignItems: "end",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
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
  clearButton: {
    padding: "10px",
    backgroundColor: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default FeedbackDateFilter;