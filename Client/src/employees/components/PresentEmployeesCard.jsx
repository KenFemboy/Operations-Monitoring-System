function PresentEmployeesCard({ attendance = [], selectedDate }) {
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const presentEmployees = attendance.filter((record) => {
    const recordDate = new Date(record.date).toISOString().split("T")[0];

    return recordDate === selectedDate && record.status === "present";
  });

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "20px",
        background: "#fff",
      }}
    >
      <h2>Calendar: {formattedDate}</h2>
      <h3>Present Employees</h3>

      {presentEmployees.length === 0 ? (
        <p>No present employees for this date.</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
  <tr>
    <th>Employee ID</th>
    <th>Employee Name</th>
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
      <td>{Number(record.totalHours || 0).toFixed(2)} hrs</td>
    </tr>
  ))}
</tbody>
        </table>
      )}
    </div>
  );
}

export default PresentEmployeesCard;