import { useState } from "react";
import { archiveProduct } from "../../../api/admin/adminInventoryApi";
import ArchiveConfirmModal from "../../archive/components/ArchiveConfirmModal";

function ProductTable({ products, onRefresh }) {
  const [archiveTarget, setArchiveTarget] = useState(null);

  const handleArchive = async (reason) => {
    try {
      await archiveProduct(archiveTarget._id, reason);
      alert("Product archived");
      setArchiveTarget(null);
      onRefresh?.();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to archive product");
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Available") {
      return {
        backgroundColor: "#d1fae5",
        color: "#065f46",
      };
    }

    if (status === "Low Stock") {
      return {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      };
    }

    return {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
    };
  };

  return (
    <div style={styles.card}>
      <h2>Product Inventory</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Product ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Branch</th>
            <th style={styles.th}>Unit</th>
            <th style={styles.th}>Current Stock</th>
            <th style={styles.th}>Minimum Stock</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td style={styles.td}>{product.productId}</td>
              <td style={styles.td}>{product.name}</td>
              <td style={styles.td}>{product.category}</td>
              <td style={styles.td}>{product.branch?.branchName || "-"}</td>
              <td style={styles.td}>{product.unit}</td>
              <td style={styles.td}>{product.currentStock}</td>
              <td style={styles.td}>{product.minimumStock}</td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.badge,
                    ...getStatusStyle(product.status),
                  }}
                >
                  {product.status}
                </span>
              </td>
              <td style={styles.td}>
                <button
                  type="button"
                  onClick={() => setArchiveTarget(product)}
                  style={styles.archiveButton}
                >
                  Archive
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && <p>No products found.</p>}
      <ArchiveConfirmModal
        isOpen={Boolean(archiveTarget)}
        title="Archive product"
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
  badge: {
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
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

export default ProductTable;
