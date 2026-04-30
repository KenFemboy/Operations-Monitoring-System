function IncidentReportTable({ reports }) {
  return (
    <div style={{ marginTop: "24px" }}>
      <h2>Incident Report List</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Incident Date</th>
            <th>Title</th>
            <th>Description</th>
            <th>Action Taken</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="7" align="center">
                No incident reports found
              </td>
            </tr>
          ) : (
            reports.map((item) => (
              <tr key={item._id}>
                <td>{item.employee?.employeeId}</td>
                <td>
                  {item.employee?.firstName} {item.employee?.lastName}
                </td>
                <td>{new Date(item.incidentDate).toLocaleDateString()}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.actionTaken || "-"}</td>
                <td>{item.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentReportTable;