function StockInTable({ stockIns }) {
  return (
    <div style={styles.card}>
      <h2>Stock In History</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Stock In ID</th>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Reason</th>
            <th style={styles.th}>Added By</th>
            <th style={styles.th}>Date</th>
          </tr>
        </thead>

        <tbody>
          {stockIns.map((stock) => (
            <tr key={stock._id}>
              <td style={styles.td}>{stock.stockInId}</td>
              <td style={styles.td}>{stock.product?.name}</td>
              <td style={styles.td}>+{stock.quantity}</td>
              <td style={styles.td}>{stock.reason}</td>
              <td style={styles.td}>{stock.addedBy}</td>
              <td style={styles.td}>
                {new Date(stock.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {stockIns.length === 0 && <p>No stock in records found.</p>}
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

export default StockInTable;