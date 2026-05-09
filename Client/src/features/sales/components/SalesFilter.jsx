function SalesFilter({ filter, setFilter, onFilter }) {
  return (
    <div style={styles.card}>
      <h2>Filter Sales</h2>

      <div style={styles.form}>
        <div>
          <label>Start Date</label>
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
          <label>End Date</label>
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            style={styles.input}
          />
        </div>

        <div>
          <label>Service</label>
          <select
            value={filter.serviceType}
            onChange={(e) =>
              setFilter({ ...filter, serviceType: e.target.value })
            }
            style={styles.input}
          >
            <option value="all">All</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>

        <button onClick={onFilter} style={styles.primaryButton}>
          Apply Filter
        </button>
      </div>
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
    padding: "11px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default SalesFilter;