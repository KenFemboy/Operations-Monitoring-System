function StockOutTable({ stockOuts }) {
  return (
    <div style={styles.card}>
      <h2>Stock Out History</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Stock Out ID</th>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Reason</th>
            <th style={styles.th}>Released By</th>
            <th style={styles.th}>Date</th>
          </tr>
        </thead>

        <tbody>
          {stockOuts.map((stock) => (
            <tr key={stock._id}>
              <td style={styles.td}>{stock.stockOutId}</td>
              <td style={styles.td}>{stock.product?.name}</td>
              <td style={styles.td}>-{stock.quantity}</td>
              <td style={styles.td}>{stock.reason}</td>
              <td style={styles.td}>{stock.releasedBy}</td>
              <td style={styles.td}>
                {new Date(stock.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {stockOuts.length === 0 && <p>No stock out records found.</p>}
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
    minWidth: "800px",
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
};

export default StockOutTable;