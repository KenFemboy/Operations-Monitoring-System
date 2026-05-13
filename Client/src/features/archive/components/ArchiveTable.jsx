const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const getBranchName = (record) =>
  record.branch?.branchName || record.assignedBranch || "-";

const getActorName = (user) => user?.name || user?.email || "-";

function ArchiveTable({ records, getIdentifier, onRestore, loading }) {
  return (
    <div style={styles.card}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Record</th>
            <th style={styles.th}>Branch</th>
            <th style={styles.th}>Archived Date</th>
            <th style={styles.th}>Archived By</th>
            <th style={styles.th}>Archive Reason</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td style={styles.empty} colSpan="6">
                {loading ? "Loading archived records..." : "No archived records found."}
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record._id}>
                <td style={styles.td}>{getIdentifier(record)}</td>
                <td style={styles.td}>{getBranchName(record)}</td>
                <td style={styles.td}>{formatDate(record.archivedAt)}</td>
                <td style={styles.td}>{getActorName(record.archivedBy)}</td>
                <td style={styles.td}>{record.archiveReason || "-"}</td>
                <td style={styles.td}>
                  <button
                    type="button"
                    onClick={() => onRestore(record)}
                    style={styles.restoreButton}
                  >
                    Restore
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
    borderRadius: "8px",
    padding: "18px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f8fafc",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    verticalAlign: "top",
  },
  empty: {
    padding: "22px",
    textAlign: "center",
    color: "#64748b",
  },
  restoreButton: {
    padding: "7px 11px",
    backgroundColor: "#15803d",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default ArchiveTable;
