function EmployeeTable({ employees, onDelete, onViewDetails, onUpdateStatus }) {
  const statuses = ["active", "inactive", "resigned", "terminated"];

  return (
    <div>
      <h2>Employee List</h2>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Branch</th>
            <th>Salary Rate per hour</th>
            <th>Status</th>
            <th>Change Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="8" align="center">
                No employees found
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.employeeId}</td>
                <td>
                  {employee.firstName} {employee.lastName}
                </td>
                <td>{employee.position}</td>
                <td>{employee.branch}</td>
                <td>₱{employee.salaryRate}</td>
                <td>{employee.employmentStatus}</td>

                <td>
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(employee._id, status)}
                      disabled={employee.employmentStatus === status}
                      style={{
                        marginRight: "6px",
                        fontWeight:
                          employee.employmentStatus === status
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </td>

                <td>
                  <button onClick={() => onViewDetails(employee._id)}>
                    View
                  </button>

                  {/* <button onClick={() => onDelete(employee._id)}>
                    Delete
                  </button> */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;