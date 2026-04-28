import { useMemo, useState } from "react";

function EmployeeTable({ employees, onDelete, onViewDetails, onUpdateStatus }) {
  const statuses = ["active", "inactive", "resigned", "terminated"];
  const [query, setQuery] = useState("");

  const filteredEmployees = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return employees;

    return employees.filter((employee) => {
      const name = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const id = String(employee.employeeId || "").toLowerCase();
      const position = String(employee.position || "").toLowerCase();
      const branch = String(employee.branch || "").toLowerCase();

      return (
        name.includes(keyword) ||
        id.includes(keyword) ||
        position.includes(keyword) ||
        branch.includes(keyword)
      );
    });
  }, [employees, query]);

  return (
    <section className="table-card employee-table-card">
      <div className="table-toolbar">
        <div>
          <h3 className="table-title">Employee List</h3>
          <p className="table-subtitle">Search by name, ID, position, or branch.</p>
        </div>
        <div className="employee-table-tools">
          <input
            className="employee-search"
            type="search"
            placeholder="Search employees"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span className="employee-count">{filteredEmployees.length} total</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Branch</th>
              <th>Salary Rate / hr</th>
              <th>Status</th>
              <th>Change Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="8" align="center">
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.employeeId}</td>
                  <td>
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td>{employee.position}</td>
                  <td>{employee.branch}</td>
                  <td>₱{employee.salaryRate}</td>
                  <td>
                    <span className="status-pill">
                      {employee.employmentStatus}
                    </span>
                  </td>

                  <td>
                    <div className="status-chip-group">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={`status-chip ${employee.employmentStatus === status ? "is-active" : ""}`}
                          onClick={() => onUpdateStatus(employee, status)}
                          disabled={employee.employmentStatus === status}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>

                  <td>
                    <div className="employee-action-row">
                      <button
                        type="button"
                        className="btn btn-secondary action-btn"
                        onClick={() => onViewDetails(employee._id)}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default EmployeeTable;