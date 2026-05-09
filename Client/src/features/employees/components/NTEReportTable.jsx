function NTEReportTable({ ntes, onUpdateStatus }) {
  return (
    <div style={{ marginTop: "24px" }}>
      <h2>NTE List</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Issue Date</th>
            <th>Subject</th>
            <th>Explanation</th>
            <th>Deadline</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {ntes.length === 0 ? (
            <tr>
              <td colSpan="7" align="center">
                No NTE records found
              </td>
            </tr>
          ) : (
            ntes.map((item) => (
              <tr key={item._id}>
                <td>{item.employee?.employeeId}</td>

                <td>
                  {item.employee?.firstName} {item.employee?.lastName}
                </td>

                <td>{new Date(item.issueDate).toLocaleDateString()}</td>

                <td>{item.subject}</td>

                <td>{item.explanation || "-"}</td>

                <td>{new Date(item.deadline).toLocaleDateString()}</td>

                <td>
                  <select
                    value={item.status}
                    onChange={(e) =>
                      onUpdateStatus(item._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NTEReportTable;