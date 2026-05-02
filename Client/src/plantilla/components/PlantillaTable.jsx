function PlantillaTable({ plantillas, onEdit, onDelete }) {
  const getStatusStyle = (status) => {
    if (status === "filled") {
      return {
        backgroundColor: "#d1fae5",
        color: "#065f46",
      };
    }

    if (status === "understaffed") {
      return {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      };
    }

    if (status === "overstaffed") {
      return {
        backgroundColor: "#dbeafe",
        color: "#1e40af",
      };
    }

    return {
      backgroundColor: "#e5e7eb",
      color: "#374151",
    };
  };

  return (
    <div style={styles.card}>
      <h2>Plantilla List</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Position</th>
            <th style={styles.th}>Branch</th>
            <th style={styles.th}>Required</th>
            <th style={styles.th}>Current</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {plantillas.length === 0 ? (
            <tr>
              <td style={styles.td} colSpan="6" align="center">
                No plantilla records found
              </td>
            </tr>
          ) : (
            plantillas.map((plantilla) => (
              <tr key={plantilla._id}>
                <td style={styles.td}>{plantilla.position}</td>
                <td style={styles.td}>{plantilla.branch}</td>
                <td style={styles.td}>{plantilla.requiredCount}</td>
                <td style={styles.td}>{plantilla.currentCount}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      ...getStatusStyle(plantilla.status),
                    }}
                  >
                    {plantilla.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button
                    type="button"
                    onClick={() => onEdit(plantilla)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(plantilla._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
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
  editButton: {
    padding: "6px 10px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "8px",
  },
  deleteButton: {
    padding: "6px 10px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PlantillaTable;