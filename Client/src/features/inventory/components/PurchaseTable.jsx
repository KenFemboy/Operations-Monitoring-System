import { useState } from "react";
import {
  archivePurchase,
  receivePurchase,
  cancelPurchase,
} from "../../../api/admin/adminInventoryApi";
import ArchiveConfirmModal from "../../archive/components/ArchiveConfirmModal";

function PurchaseTable({ purchases, onRefresh }) {
  const [archiveTarget, setArchiveTarget] = useState(null);

  const handleReceive = async (id) => {
    try {
      await receivePurchase(id);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to receive purchase");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelPurchase(id);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel purchase");
    }
  };

  const handleArchive = async (reason) => {
    try {
      await archivePurchase(archiveTarget._id, reason);
      alert("Purchase archived");
      setArchiveTarget(null);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to archive purchase");
    }
  };

  return (
    <div style={styles.card}>
      <h2>Purchase Records</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Purchase ID</th>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Supplier</th>
            <th style={styles.th}>Qty</th>
            <th style={styles.th}>Unit Cost</th>
            <th style={styles.th}>Total</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase._id}>
              <td style={styles.td}>{purchase.purchaseId}</td>
              <td style={styles.td}>{purchase.product?.name}</td>
              <td style={styles.td}>{purchase.supplierName}</td>
              <td style={styles.td}>{purchase.quantity}</td>
              <td style={styles.td}>₱{purchase.unitCost}</td>
              <td style={styles.td}>₱{purchase.totalCost}</td>
              <td style={styles.td}>{purchase.status}</td>
              <td style={styles.td}>
                {purchase.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleReceive(purchase._id)}
                      style={styles.smallButton}
                    >
                      Receive
                    </button>

                    <button
                      onClick={() => handleCancel(purchase._id)}
                      style={styles.dangerButton}
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setArchiveTarget(purchase)}
                  style={styles.dangerButton}
                >
                  Archive
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {purchases.length === 0 && <p>No purchase records found.</p>}
      <ArchiveConfirmModal
        isOpen={Boolean(archiveTarget)}
        title="Archive purchase"
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
  smallButton: {
    padding: "6px 10px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "6px",
  },
  dangerButton: {
    padding: "6px 10px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PurchaseTable;
