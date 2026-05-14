import { useEffect, useState } from "react";
import BranchEmployeePicker from "./BranchEmployeePicker";

function LeaveForm({
  employees,
  branches = [],
  useBranchPicker = false,
  onSubmit,
  editingLeave,
  onCancelEdit,
}) {
  const [form, setForm] = useState({
    employee: "",
    branchId: "",
    leaveType: "SIL",
    startDate: "",
    endDate: "",
    reason: "",
    status: "pending",
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
    if (editingLeave) {
      const employeeId = editingLeave.employee?._id || editingLeave.employee || "";
      const employee = employees.find((item) => item._id === employeeId);

      setForm({
        employee: employeeId,
        branchId: employee?.branch?._id || employee?.branch || "",
        leaveType: editingLeave.leaveType || "SIL",
        startDate: editingLeave.startDate
          ? editingLeave.startDate.split("T")[0]
          : "",
        endDate: editingLeave.endDate
          ? editingLeave.endDate.split("T")[0]
          : "",
        reason: editingLeave.reason || "",
        status: editingLeave.status || "pending",
      });
    }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [editingLeave, employees]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      employee: "",
      branchId: "",
      leaveType: "SIL",
      startDate: "",
      endDate: "",
      reason: "",
      status: "pending",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (useBranchPicker && !form.employee) {
      alert("Please select an employee");
      return;
    }

    const { branchId: _branchId, ...payload } = form;
    onSubmit(payload);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>{editingLeave ? "Edit Leave" : "File Leave"}</h2>

      <div className="employee-form-sections">
        <section className="employee-form-section">
          <h4>Employee & Type</h4>
          <div className="employee-form-grid">
            <BranchEmployeePicker
              employees={employees}
              branches={branches}
              value={form.employee}
              onChange={(employee) => setForm({ ...form, employee })}
              branchId={form.branchId}
              onBranchChange={(branchId) =>
                setForm({ ...form, branchId, employee: "" })
              }
              useBranchPicker={useBranchPicker}
            />

            <label className="employee-field">
              <span>Leave Type</span>
              <select name="leaveType" value={form.leaveType} onChange={handleChange}>
                <option value="SIL">SIL</option>
                <option value="Vacation Leave">Vacation Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Others">Others</option>
              </select>
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Date Range</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Start Date</span>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </label>

            <label className="employee-field">
              <span>End Date</span>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </label>

            <label className="employee-field">
              <span>Status</span>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Reason</h4>
          <div className="employee-form-grid">
            <label className="employee-field employee-field-full">
              <span>{form.leaveType === "Others" ? "Reason / Description" : "Reason"}</span>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>
      </div>

      <div className="form-actions">
        <button type="submit">
          {editingLeave ? "Update Leave" : "Submit Leave"}
        </button>

        {editingLeave && (
          <button type="button" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

export default LeaveForm;
