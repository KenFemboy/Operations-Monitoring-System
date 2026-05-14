import { useState } from "react";

function BranchEmployeePicker({
  employees = [],
  branches = [],
  value,
  onChange,
  branchId,
  onBranchChange,
  useBranchPicker = false,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedEmployee = employees.find((employee) => employee._id === value);
  const selectedBranch = branches.find((branch) => branch._id === branchId);
  const filteredEmployees = employees.filter((employee) => {
    const employeeBranchId = employee.branch?._id || employee.branch || "";

    return String(employeeBranchId) === branchId;
  });

  if (!useBranchPicker) {
    return (
      <label className="employee-field">
        <span>Employee</span>
        <select
          name="employee"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.employeeId} - {employee.firstName} {employee.lastName}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <>
      <label className="employee-field">
        <span>Branch</span>
        <select
          value={branchId}
          onChange={(event) => onBranchChange(event.target.value)}
          required
        >
          <option value="">Select Branch</option>
          {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.branchName}
            </option>
          ))}
        </select>
      </label>

      <div className="employee-field">
        <span>Employee</span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={!branchId}
          style={styles.selectButton}
        >
          {selectedEmployee
            ? `${selectedEmployee.employeeId} - ${selectedEmployee.firstName} ${selectedEmployee.lastName}`
            : "Select Employee"}
        </button>
      </div>

      {isModalOpen && (
        <div style={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalPanel} onClick={(event) => event.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>Select Employee</h3>
                <p style={styles.modalText}>{selectedBranch?.branchName || "Selected branch"}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={styles.closeButton}
              >
                Close
              </button>
            </div>

            {filteredEmployees.length === 0 ? (
              <div className="table-empty">No employees found for this branch.</div>
            ) : (
              <div style={styles.employeeList}>
                {filteredEmployees.map((employee) => (
                  <button
                    key={employee._id}
                    type="button"
                    onClick={() => {
                      onChange(employee._id);
                      setIsModalOpen(false);
                    }}
                    style={styles.employeeOption}
                  >
                    <strong>{employee.employeeId}</strong>
                    <span>
                      {employee.firstName} {employee.lastName}
                    </span>
                    <small>{employee.position || "No position"}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  selectButton: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    textAlign: "left",
    cursor: "pointer",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    backgroundColor: "rgba(15, 23, 42, 0.58)",
  },
  modalPanel: {
    width: "min(720px, 96vw)",
    maxHeight: "86vh",
    overflow: "auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "18px",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.3)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "start",
    marginBottom: "14px",
  },
  modalTitle: {
    margin: 0,
  },
  modalText: {
    margin: "4px 0 0",
    color: "#64748b",
  },
  closeButton: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
  },
  employeeList: {
    display: "grid",
    gap: "10px",
  },
  employeeOption: {
    display: "grid",
    gap: "4px",
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "#fff",
    textAlign: "left",
    cursor: "pointer",
  },
};

export default BranchEmployeePicker;
