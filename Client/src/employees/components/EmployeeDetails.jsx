function EmployeeDetails({ details, onClose }) {
  if (!details) return null;

  const {
    employee,
    attendance,
    payrolls,
    leaves,
    contributions,
    incidentReports,
    ntes,
  } = details;

  const thStyle = {
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  padding: "12px",
  whiteSpace: "nowrap",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "12px",
  whiteSpace: "nowrap",
};


  return (
    <div style={{ marginTop: "24px", padding: "20px", border: "1px solid #ccc" }}>
      <button onClick={onClose}>Close Details</button>

      <h2>
        {employee.firstName} {employee.lastName}
      </h2>

      <p><strong>Employee ID:</strong> {employee.employeeId}</p>
      <p><strong>Position:</strong> {employee.position}</p>
      <p><strong>Branch:</strong> {employee.branch}</p>
      <p><strong>Status:</strong> {employee.employmentStatus}</p>

      <hr />

<h3>Attendance</h3>

{attendance.length === 0 ? (
  <p>No attendance records.</p>
) : (
  <div
    style={{
      maxHeight: "320px",
      overflowY: "auto",
      overflowX: "auto",
      border: "1px solid #ddd",
      borderRadius: "10px",
    }}
  >
    <table
      cellPadding="10"
      style={{
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "700px",
      }}
    >
      <thead
        style={{
          position: "sticky",
          top: 0,
          background: "#f5f5f5",
          zIndex: 1,
        }}
      >
        <tr>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Time In</th>
          <th style={thStyle}>Time Out</th>
          <th style={thStyle}>Hours</th>
          <th style={thStyle}>Status</th>
          <th style={thStyle}>Remarks</th>
        </tr>
      </thead>

      <tbody>
        {attendance.map((item) => (
          <tr key={item._id}>
            <td style={tdStyle}>
              {new Date(item.date).toLocaleDateString()}
            </td>
            <td style={tdStyle}>{item.timeIn || "-"}</td>
            <td style={tdStyle}>{item.timeOut || "-"}</td>
            <td style={tdStyle}>
              {Number(item.totalHours || 0).toFixed(2)} hrs
            </td>
            <td style={tdStyle}>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "20px",
                  background:
                    item.status === "present"
                      ? "#d1fae5"
                      : item.status === "late"
                      ? "#fef3c7"
                      : item.status === "half-day"
                      ? "#dbeafe"
                      : "#fee2e2",
                  color:
                    item.status === "present"
                      ? "#065f46"
                      : item.status === "late"
                      ? "#92400e"
                      : item.status === "half-day"
                      ? "#1e40af"
                      : "#991b1b",
                }}
              >
                {item.status}
              </span>
            </td>
            <td style={tdStyle}>{item.remarks || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      <h3>Payroll</h3>
      {payrolls.length === 0 ? (
        <p>No payroll records.</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Period Start</th>
              <th>Period End</th>
              <th>Basic Pay</th>
              <th>Overtime</th>
              <th>Deductions</th>
              <th>Net Pay</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((item) => (
              <tr key={item._id}>
                <td>{new Date(item.payPeriodStart).toLocaleDateString()}</td>
                <td>{new Date(item.payPeriodEnd).toLocaleDateString()}</td>
                <td>₱{item.basicPay}</td>
                <td>₱{item.overtimePay}</td>
                <td>₱{item.deductions}</td>
                <td>₱{item.netPay}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Leave</h3>
      {leaves.length === 0 ? (
        <p>No leave records.</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Type</th>
              <th>Start</th>
              <th>End</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((item) => (
              <tr key={item._id}>
                <td>{item.leaveType}</td>
                <td>{new Date(item.startDate).toLocaleDateString()}</td>
                <td>{new Date(item.endDate).toLocaleDateString()}</td>
                <td>{item.reason}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Contributions</h3>
      {contributions.length === 0 ? (
        <p>No contribution records.</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Month</th>
              <th>SSS</th>
              <th>Pag-IBIG</th>
              <th>PhilHealth</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((item) => (
              <tr key={item._id}>
                <td>{item.month}</td>
                <td>₱{item.sss}</td>
                <td>₱{item.pagibig}</td>
                <td>₱{item.philhealth}</td>
                <td>₱{item.totalContribution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Incident Reports</h3>
      {incidentReports.length === 0 ? (
        <p>No incident reports.</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Description</th>
              <th>Action Taken</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {incidentReports.map((item) => (
              <tr key={item._id}>
                <td>{new Date(item.incidentDate).toLocaleDateString()}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.actionTaken}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>NTE</h3>
      {ntes.length === 0 ? (
        <p>No NTE records.</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Issue Date</th>
              <th>Subject</th>
              <th>Explanation</th>
              <th>Deadline</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ntes.map((item) => (
              <tr key={item._id}>
                <td>{new Date(item.issueDate).toLocaleDateString()}</td>
                <td>{item.subject}</td>
                <td>{item.explanation}</td>
                <td>{new Date(item.deadline).toLocaleDateString()}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeDetails;