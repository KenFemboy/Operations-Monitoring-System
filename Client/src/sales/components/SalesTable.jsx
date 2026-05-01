import { deleteSale } from "../api/salesApi";

function SalesTable({ sales, onRefresh }) {
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this sale record?");

    if (!confirmDelete) return;

    try {
      await deleteSale(id);
      alert("Sale deleted");
      onRefresh();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete sale");
    }
  };

  const getCustomerTypeLabel = (type) => {
    if (type === "kid") return "Kid / Children";
    if (type === "adultUnder4ft") return "Adult under 4ft";
    if (type === "adult") return "Adult";
    return type;
  };

  return (
    <div style={styles.card}>
      <h2>Sales Records</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Service</th>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Customer Type</th>
            <th style={styles.th}>Senior</th>
            <th style={styles.th}>PWD</th>
            <th style={styles.th}>Base Price</th>
            <th style={styles.th}>Discount</th>
            <th style={styles.th}>Total</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((sale) => (
            <tr key={sale._id}>
              <td style={styles.td}>{sale.saleDate}</td>
              <td style={styles.td}>{sale.serviceType}</td>
              <td style={styles.td}>{sale.customerName || "Walk-in"}</td>
              <td style={styles.td}>
                {getCustomerTypeLabel(sale.customerType)}
              </td>
              <td style={styles.td}>{sale.isSenior ? "Yes" : "No"}</td>
              <td style={styles.td}>{sale.isPWD ? "Yes" : "No"}</td>
              <td style={styles.td}>₱{sale.basePrice}</td>
              <td style={styles.td}>₱{sale.discount}</td>
              <td style={styles.td}>
                <strong>₱{sale.totalAmount}</strong>
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => handleDelete(sale._id)}
                  style={styles.dangerButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sales.length === 0 && <p>No sales records found.</p>}
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
    minWidth: "1000px",
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
  dangerButton: {
    padding: "6px 10px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default SalesTable;