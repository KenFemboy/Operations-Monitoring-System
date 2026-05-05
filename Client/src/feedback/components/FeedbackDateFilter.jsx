import { useState } from "react";

function FeedbackDateFilter({ branches = [], onFilter, onClear }) {
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    branch: "all",
    mealSession: "all",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    onFilter(filter);
  };

  const handleClear = () => {
    const clearedFilter = {
      startDate: "",
      endDate: "",
      branch: "all",
      mealSession: "all",
    };

    setFilter(clearedFilter);
    onClear();
  };

  return (
    <div style={styles.card}>
      <h2>Filter Reviews</h2>

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

        <div>
          <label style={styles.label}>Branch</label>
          <select
            value={filter.branch}
            onChange={(e) => setFilter({ ...filter, branch: e.target.value })}
            style={styles.input}
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.branchName} - {branch.location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Lunch / Dinner</label>
          <select
            value={filter.mealSession}
            onChange={(e) =>
              setFilter({ ...filter, mealSession: e.target.value })
            }
            style={styles.input}
          >
            <option value="all">All</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
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
