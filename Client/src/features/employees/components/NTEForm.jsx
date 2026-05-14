import { useState } from "react";

function NTEForm({ employees, branches = [], onSubmit }) {
  const [form, setForm] = useState({
    employee: "",
    branchId: "",
    subject: "",
    explanation: "",
    deadline: "",
  });
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const selectedBranch = branches.find((branch) => branch._id === form.branchId);
  const selectedEmployee = employees.find((employee) => employee._id === form.employee);
  const filteredEmployees = employees.filter((employee) => {
    const employeeBranchId = employee.branch?._id || employee.branch || "";

    return String(employeeBranchId) === form.branchId;
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBranchChange = (e) => {
    setForm({
      ...form,
      branchId: e.target.value,
      employee: "",
    });
  };

  const handleSelectEmployee = (employee) => {
    setForm({
      ...form,
      employee: employee._id,
    });
    setIsEmployeeModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { branchId: _branchId, ...payload } = form;
    onSubmit(payload);

    setForm({
      employee: "",
      branchId: "",
      subject: "",
      explanation: "",
      deadline: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>Create Notice to Explain</h2>

      <div className="employee-form-sections">
        <section className="employee-form-section">
          <h4>Branch & Employee</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Branch</span>
              <select name="branchId" value={form.branchId} onChange={handleBranchChange} required>
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
                onClick={() => setIsEmployeeModalOpen(true)}
                disabled={!form.branchId}
                style={styles.selectEmployeeButton}
              >
                {selectedEmployee
                  ? `${selectedEmployee.employeeId} - ${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                  : "Select Employee"}
              </button>
              <input type="hidden" name="employee" value={form.employee} required />
            </div>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Notice Details</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Subject</span>
              <input name="subject" value={form.subject} onChange={handleChange} required />
            </label>
            <label className="employee-field">
              <span>Deadline</span>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
            </label>
            <label className="employee-field employee-field-full">
              <span>Explanation</span>
              <textarea
                name="explanation"
                value={form.explanation}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>
      </div>

      <div className="form-actions">
        <button type="submit">Save NTE</button>
      </div>

      {isEmployeeModalOpen && (
        <div style={styles.modalBackdrop} onClick={() => setIsEmployeeModalOpen(false)}>
          <div style={styles.modalPanel} onClick={(event) => event.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>Select Employee</h3>
                <p style={styles.modalText}>{selectedBranch?.branchName || "Selected branch"}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEmployeeModalOpen(false)}
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
                    onClick={() => handleSelectEmployee(employee)}
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
    </form>
  );
}

const styles = {
  selectEmployeeButton: {
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

export default NTEForm;
