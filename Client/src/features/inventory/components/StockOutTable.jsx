import { useState } from "react";
import { archiveStockOut } from "../../../api/admin/adminInventoryApi";
import ArchiveConfirmModal from "../../archive/components/ArchiveConfirmModal";

function StockOutTable({ stockOuts, onRefresh }) {
  const [archiveTarget, setArchiveTarget] = useState(null);

  const handleArchive = async (reason) => {
    try {
      await archiveStockOut(archiveTarget._id, reason);
      alert("Stock out record archived");
      setArchiveTarget(null);
      onRefresh?.();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to archive stock out record");
    }
  };

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
            <th style={styles.th}>Action</th>
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
              <td style={styles.td}>
                <button
                  type="button"
                  onClick={() => setArchiveTarget(stock)}
                  style={styles.archiveButton}
                >
                  Archive
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {stockOuts.length === 0 && <p>No stock out records found.</p>}
      <ArchiveConfirmModal
        isOpen={Boolean(archiveTarget)}
        title="Archive stock out record"
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
      />
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
  archiveButton: {
    padding: "6px 10px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default StockOutTable;
