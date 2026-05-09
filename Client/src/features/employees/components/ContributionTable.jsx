function ContributionTable({ contributions }) {
  return (
    <div style={{ marginTop: "24px", overflowX: "auto" }}>
      <h2>Contribution List</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Branch</th>
            <th>SSS ID</th>
            <th>GSIS ID</th>
            <th>Pag-IBIG ID</th>
            <th>PhilHealth ID</th>
            <th>Month</th>
            <th>SSS</th>
            <th>Pag-IBIG</th>
            <th>PhilHealth</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {contributions.length === 0 ? (
            <tr>
              <td colSpan="12" align="center">
                No contribution records found
              </td>
            </tr>
          ) : (
            contributions.map((item) => (
              <tr key={item._id}>
                <td>{item.employee?.employeeId}</td>

                <td>
                  {item.employee?.firstName} {item.employee?.lastName}
                </td>

                <td>{item.employee?.assignedBranch || "-"}</td>

                <td>{item.employee?.sssId || "-"}</td>
                <td>{item.employee?.gsisId || "-"}</td>
                <td>{item.employee?.pagibigId || "-"}</td>
                <td>{item.employee?.philhealthId || "-"}</td>

                <td>{item.month}</td>
                <td>₱{Number(item.sss || 0).toFixed(2)}</td>
                <td>₱{Number(item.pagibig || 0).toFixed(2)}</td>
                <td>₱{Number(item.philhealth || 0).toFixed(2)}</td>
                <td>₱{Number(item.totalContribution || 0).toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ContributionTable;