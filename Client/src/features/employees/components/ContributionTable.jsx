const formatMonth = (value) => {
  if (!value) return "-";
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

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
            <th>SSS</th>
            <th>PhilHealth</th>
            <th>Pag-IBIG</th>
            <th>TIN ID</th>
            <th>Month</th>
            <th>SSS Contribution</th>
            <th>Pag-IBIG Contribution</th>
            <th>PhilHealth Contribution</th>
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

                <td>{item.employee?.sss || item.employee?.sssId || "-"}</td>
                <td>{item.employee?.philhealth || item.employee?.philhealthId || "-"}</td>
                <td>{item.employee?.pagibig || item.employee?.pagibigId || "-"}</td>
                <td>{item.employee?.tin || "-"}</td>

                <td>{formatMonth(item.month)}</td>
                <td>PHP {Number(item.sss || 0).toFixed(2)}</td>
                <td>PHP {Number(item.pagibig || 0).toFixed(2)}</td>
                <td>PHP {Number(item.philhealth || 0).toFixed(2)}</td>
                <td>PHP {Number(item.totalContribution || 0).toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ContributionTable;
