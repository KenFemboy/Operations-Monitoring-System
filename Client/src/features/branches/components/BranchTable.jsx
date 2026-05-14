function BranchTable({ branches, onEdit, onDelete, onView }) {
  return (
    <div style={styles.card}>
      <h2>Branch List</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Branch Name</th>
            <th style={styles.th}>Location</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {branches.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.empty}>
                No branches found.
              </td>
            </tr>
          ) : (
            branches.map((branch) => (
              <tr key={branch._id}>
                <td style={styles.td}>{branch.branchName}</td>
                <td style={styles.td}>{branch.location}</td>
                <td style={styles.td}>{branch.address}</td>
                <td style={styles.td}>{branch.status}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => onView(branch)}
                    style={styles.viewButton}
                  >
                    View Records
                  </button>

                  <button
                    onClick={() => onEdit(branch)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      const authorizationPassword = window.prompt(
                        "Enter superadmin password to delete this branch:"
                      );

                      if (!authorizationPassword) {
                        return;
                      }

                      onDelete(branch._id, authorizationPassword);
                    }}
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
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },
  th: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f9fafb",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
  empty: {
    textAlign: "center",
    padding: "20px",
  },
  viewButton: {
    padding: "6px 10px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    marginRight: "6px",
    cursor: "pointer",
  },
  editButton: {
    padding: "6px 10px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    marginRight: "6px",
    cursor: "pointer",
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

export default BranchTable;
