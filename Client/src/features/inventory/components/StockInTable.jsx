import { useState } from "react";
import { archiveStockIn } from "../../../api/admin/adminInventoryApi";
import ArchiveConfirmModal from "../../archive/components/ArchiveConfirmModal";

function StockInTable({ stockIns, onRefresh }) {
  const [archiveTarget, setArchiveTarget] = useState(null);

  const handleArchive = async (reason) => {
    try {
      await archiveStockIn(archiveTarget._id, reason);
      alert("Stock in record archived");
      setArchiveTarget(null);
      onRefresh?.();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to archive stock in record");
    }
  };

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
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {stockIns.map((stock) => (
            <tr key={stock._id}>
              <td style={styles.td}>{stock.stockInId}</td>
              <td style={styles.td}>{stock.product?.name}</td>
              <td style={styles.td}>+{stock.quantity}</td>
              <td style={styles.td}>{stock.reason}</td>
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

      {stockIns.length === 0 && <p>No stock in records found.</p>}
      <ArchiveConfirmModal
        isOpen={Boolean(archiveTarget)}
        title="Archive stock in record"
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

export default StockInTable;
