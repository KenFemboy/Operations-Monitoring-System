function EmployeeTable({
  employees,
  onDelete,
  onViewDetails,
  onUpdateStatus,
  onEdit,
}) {
  return (
    <div style={styles.card}>
      <h2>Employee List</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Employee ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Position</th>
            <th style={styles.th}>Assigned Branch</th>
            <th style={styles.th}>Salary Rate</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td style={styles.td} colSpan="7" align="center">
                No employees found
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee._id}>
                <td style={styles.td}>{employee.employeeId}</td>

                <td style={styles.td}>
                  {employee.firstName} {employee.lastName}
                </td>

                <td style={styles.td}>{employee.position}</td>

                <td style={styles.td}>
                  {employee.branch?.branchName || employee.assignedBranch || "-"}
                </td>

                <td style={styles.td}>
                  ₱{Number(employee.salaryRate || 0).toFixed(2)}
                </td>

                <td style={styles.td}>
                  <select
                    value={employee.employmentStatus}
                    onChange={(e) =>
                      onUpdateStatus(employee._id, e.target.value)
                    }
                    style={styles.statusSelect}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="resigned">Resigned</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </td>

                <td style={styles.td}>
                  <div style={styles.actionGroup}>
                    <button
                      type="button"
                      onClick={() => onViewDetails(employee._id)}
                      style={styles.viewButton}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(employee)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(employee._id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
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
    minWidth: "720px",
  },

  th: {
    borderBottom: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#f9fafb",
    whiteSpace: "normal",
    fontSize: "14px",
    lineHeight: 1.4,
  },

  td: {
    borderBottom: "1px solid #eee",
    padding: "12px",
    whiteSpace: "normal",
    wordBreak: "break-word",
    fontSize: "14px",
    lineHeight: 1.4,
  },

  actionGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },

  statusSelect: {
    padding: "7px 10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },

  viewButton: {
    padding: "6px 10px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "6px",
  },

  editButton: {
    padding: "6px 10px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "6px",
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

export default EmployeeTable;
