function PresentEmployeesCard({ attendance = [], selectedDate, selectedBranch = "all" }) {
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const presentEmployees = attendance.filter((record) => {
    const recordDate = new Date(record.date).toISOString().split("T")[0];
    const branchId = record.branch?._id || record.branch || "";

    return (
      recordDate === selectedDate &&
      record.status === "present" &&
      (selectedBranch === "all" || String(branchId) === selectedBranch)
    );
  });

  return (
    <section className="table-card attendance-table-card">
      <div className="table-toolbar">
        <div>
          <p className="attendance-table-kicker">Calendar</p>
          <h3 className="table-title">Present Employees</h3>
          <p className="table-subtitle">{formattedDate}</p>
        </div>
        <span className="attendance-count">
          {presentEmployees.length} present
        </span>
      </div>

      {presentEmployees.length === 0 ? (
        <div className="table-empty">No present employees for this date.</div>
      ) : (
        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Branch</th>
                <th>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {presentEmployees.map((record) => (
                <tr key={record._id}>
                  <td>{record.employee?.employeeId}</td>
                  <td>
                    {record.employee?.firstName} {record.employee?.lastName}
                  </td>
                  <td>{record.branch?.branchName || record.employee?.assignedBranch || "-"}</td>
                  <td>{Number(record.totalHours || 0).toFixed(2)} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default PresentEmployeesCard;
