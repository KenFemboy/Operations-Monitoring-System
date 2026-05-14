import { useState } from "react";

function EmployeeTable({
  employees,
  onDelete,
  onViewDetails,
  onUpdateStatus,
  onEdit,
  canDelete = false,
}) {
  const [employeeIdSearch, setEmployeeIdSearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");
  const normalizedEmployeeIdSearch = employeeIdSearch.trim().toLowerCase();
  const normalizedBranchSearch = branchSearch.trim().toLowerCase();
  const filteredEmployees = employees.filter((employee) => {
    const employeeId = (employee.employeeId || "").toLowerCase();
    const branchName = (
      employee.branch?.branchName ||
      employee.assignedBranch ||
      ""
    ).toLowerCase();

    return (
      (!normalizedEmployeeIdSearch ||
        employeeId.includes(normalizedEmployeeIdSearch)) &&
      (!normalizedBranchSearch || branchName.includes(normalizedBranchSearch))
    );
  });

  return (
    <section className="table-card employee-table-card">
      <div className="table-toolbar employee-table-toolbar">
        <h2 className="table-title">Employee List</h2>
        <span className="employee-count">{filteredEmployees.length} records</span>
      </div>

      <div className="employee-table-search-row">
        <label className="employee-search-field">
          <span>Employee ID</span>
          <input
            value={employeeIdSearch}
            onChange={(event) => setEmployeeIdSearch(event.target.value)}
            placeholder="Search employee ID"
            className="employee-search"
          />
        </label>
        <label className="employee-search-field">
          <span>Branch</span>
          <input
            value={branchSearch}
            onChange={(event) => setBranchSearch(event.target.value)}
            placeholder="Search branch"
            className="employee-search"
          />
        </label>
      </div>

      <div className="table-wrapper">
        <table className="employee-table employee-compact-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Assigned Branch</th>
            <th>Daily Rate</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan="7" align="center" className="table-empty">
                No employees found
              </td>
            </tr>
          ) : (
            filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.employeeId}</td>

                <td>
                  {employee.firstName} {employee.middleName} {employee.lastName}
                </td>

                <td>{employee.position}</td>

                <td>
                  {employee.branch?.branchName || employee.assignedBranch || "-"}
                </td>

                <td>
                  PHP {Number(employee.basicRate ?? employee.salaryRate ?? 0).toFixed(2)}
                </td>

                <td>
                  <select
                    value={employee.employmentStatus || "active"}
                    onChange={(e) =>
                      onUpdateStatus(employee._id, e.target.value)
                    }
                    className="inline-select"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>

                <td>
                  <div className="employee-action-row">
                    <button
                      type="button"
                      onClick={() => onViewDetails(employee._id)}
                      className="btn btn-success action-btn"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(employee)}
                      className="btn btn-primary action-btn"
                    >
                      Edit
                    </button>

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(employee._id)}
                        className="btn btn-danger action-btn"
                      >
                        Archive
                      </button>
                    )}
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
