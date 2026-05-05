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

  return (
    <div
      className="employee-details-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="employee-details-card">
        <div className="employee-details-header">
          <div>
            <p className="employee-details-eyebrow">Employee Profile</p>
            <h2>
              {employee.firstName} {employee.lastName}
            </h2>
          </div>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="employee-details-meta">
          <p><strong>Employee ID:</strong> {employee.employeeId}</p>
          <p><strong>Position:</strong> {employee.position}</p>
          <p>
            <strong>Assigned Branch:</strong>{" "}
            {employee.branch?.branchName || employee.assignedBranch || "-"}
          </p>
          <p><strong>SSS ID:</strong> {employee.sssId || "-"}</p>
          <p><strong>GSIS ID:</strong> {employee.gsisId || "-"}</p>
          <p><strong>Pag-IBIG ID:</strong> {employee.pagibigId || "-"}</p>
          <p><strong>PhilHealth ID:</strong> {employee.philhealthId || "-"}</p>
        </div>

        <div className="employee-details-scroll">
          <section className="table-card">
            <div className="table-toolbar">
              <h3 className="table-title">Attendance</h3>
            </div>
            {attendance.length === 0 ? (
              <div className="table-empty">No attendance records.</div>
            ) : (
              <div className="table-wrapper employee-attendance-scroll">
                <table className="employee-details-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time In</th>
                      <th>Time Out</th>
                      <th>Hours</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((item) => (
                      <tr key={item._id}>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>{item.timeIn || "-"}</td>
                        <td>{item.timeOut || "-"}</td>
                        <td>{Number(item.totalHours || 0).toFixed(2)} hrs</td>
                        <td>
                          <span className={`status-pill status-${item.status}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>{item.remarks || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="table-card">
            <div className="table-toolbar">
              <h3 className="table-title">Payroll</h3>
            </div>
            {payrolls.length === 0 ? (
              <div className="table-empty">No payroll records.</div>
            ) : (
              <div className="table-wrapper">
                <table className="employee-details-table">
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
              </div>
            )}
          </section>

          <section className="table-card">
            <div className="table-toolbar">
              <h3 className="table-title">Leave</h3>
            </div>
            {leaves.length === 0 ? (
              <div className="table-empty">No leave records.</div>
            ) : (
              <div className="table-wrapper">
                <table className="employee-details-table">
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
              </div>
            )}
          </section>

          <section className="table-card">
            <div className="table-toolbar">
              <h3 className="table-title">Contributions</h3>
            </div>
            {contributions.length === 0 ? (
              <div className="table-empty">No contribution records.</div>
            ) : (
              <div className="table-wrapper">
                <table className="employee-details-table">
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
              </div>
            )}
          </section>

          <section className="table-card">
            <div className="table-toolbar">
              <h3 className="table-title">Incident Reports</h3>
            </div>
            {incidentReports.length === 0 ? (
              <div className="table-empty">No incident reports.</div>
            ) : (
              <div className="table-wrapper">
                <table className="employee-details-table">
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
              </div>
            )}
          </section>

          <section className="table-card">
            <div className="table-toolbar">
              <h3 className="table-title">Notice to Explain</h3>
            </div>
            {ntes.length === 0 ? (
              <div className="table-empty">No NTE records.</div>
            ) : (
              <div className="table-wrapper">
                <table className="employee-details-table">
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
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
