function InventoryRecordsTable({ records }) {
  return (
    <div style={styles.card}>
      <h2>Filtered Records</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date & Time</th>
            <th style={styles.th}>Record ID</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Reason</th>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Remarks</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr key={`${record.type}-${record._id}`}>
              <td style={styles.td}>
                {new Date(record.createdAt).toLocaleString()}
              </td>

              <td style={styles.td}>{record.recordId}</td>

              <td style={styles.td}>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor:
                      record.type === "Stock In" ? "#d1fae5" : "#fee2e2",
                    color:
                      record.type === "Stock In" ? "#065f46" : "#991b1b",
                  }}
                >
                  {record.type}
                </span>
              </td>

              <td style={styles.td}>{record.product?.name}</td>
              <td style={styles.td}>{record.displayQuantity}</td>
              <td style={styles.td}>{record.reason}</td>
              <td style={styles.td}>{record.user}</td>
              <td style={styles.td}>{record.remarks || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {records.length === 0 && <p>No inventory records found.</p>}
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
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },
  th: {
    borderBottom: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#f9fafb",
  },
  td: {
    borderBottom: "1px solid #eee",
    padding: "12px",
  },
  badge: {
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
  },
};

export default InventoryRecordsTable;