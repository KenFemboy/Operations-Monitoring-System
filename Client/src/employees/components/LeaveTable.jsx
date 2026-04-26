function LeaveTable({ leaves, onUpdateStatus, onEdit }) {
  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff = end - start;
    const days = diff / (1000 * 60 * 60 * 24) + 1;

    return days > 0 ? days : 0;
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <h2>Leave Records</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Leave Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Duration</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Change Status</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="10" align="center">
                No leave records found
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.employee?.employeeId}</td>
                <td>
                  {leave.employee?.firstName} {leave.employee?.lastName}
                </td>
                <td>{leave.leaveType}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>
                  {getDuration(leave.startDate, leave.endDate)} day(s)
                </td>
                <td>{leave.reason || "-"}</td>
                <td>{leave.status}</td>

                <td>
                  {["pending", "approved", "denied"].map((status) => (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(leave._id, status)}
                      disabled={leave.status === status}
                      style={{ marginRight: "6px" }}
                    >
                      {status}
                    </button>
                  ))}
                </td>

                <td>
                  <button onClick={() => onEdit(leave)}>
                    Edit
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

export default LeaveTable;