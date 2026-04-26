function PayrollTable({ payrolls, onUpdateStatus }) {
  return (
    <div style={{ marginTop: "24px" }}>
      <h2>Payroll List</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Period</th>
            <th>Hourly Rate</th>
            <th>Hours Worked</th>
            <th>Basic Pay</th>
            <th>Overtime</th>
            <th>Deductions</th>
            <th>Net Pay</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {payrolls.length === 0 ? (
            <tr>
              <td colSpan="11" align="center">
                No payroll records found
              </td>
            </tr>
          ) : (
            payrolls.map((payroll) => (
              <tr key={payroll._id}>
                <td>{payroll.employee?.employeeId}</td>
                <td>
                  {payroll.employee?.firstName} {payroll.employee?.lastName}
                </td>
                <td>
                  {new Date(payroll.payPeriodStart).toLocaleDateString()} -{" "}
                  {new Date(payroll.payPeriodEnd).toLocaleDateString()}
                </td>
                <td>₱{Number(payroll.hourlyRate || 0).toFixed(2)}</td>
                <td>{Number(payroll.totalHoursWorked || 0).toFixed(2)} hrs</td>
                <td>₱{Number(payroll.basicPay || 0).toFixed(2)}</td>
                <td>₱{Number(payroll.overtimePay || 0).toFixed(2)}</td>
                <td>₱{Number(payroll.deductions || 0).toFixed(2)}</td>
                <td>₱{Number(payroll.netPay || 0).toFixed(2)}</td>
                <td>{payroll.status}</td>
                <td>
                  {payroll.status === "pending" ? (
                    <button onClick={() => onUpdateStatus(payroll._id, "done")}>
                      Mark Done
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateStatus(payroll._id, "pending")}
                    >
                      Mark Pending
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PayrollTable;