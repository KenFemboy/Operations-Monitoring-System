import { useEffect, useState } from "react";

function LeaveForm({ employees, onSubmit, editingLeave, onCancelEdit }) {
  const [form, setForm] = useState({
    employee: "",
    leaveType: "SIL",
    startDate: "",
    endDate: "",
    reason: "",
    status: "pending",
  });

  useEffect(() => {
    if (editingLeave) {
      setForm({
        employee: editingLeave.employee?._id || editingLeave.employee || "",
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
  }, [editingLeave]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      employee: "",
      leaveType: "SIL",
      startDate: "",
      endDate: "",
      reason: "",
      status: "pending",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingLeave ? "Edit Leave" : "File Leave"}</h2>

      <select
        name="employee"
        value={form.employee}
        onChange={handleChange}
        required
      >
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.employeeId} - {emp.firstName} {emp.lastName}
          </option>
        ))}
      </select>

      <select name="leaveType" value={form.leaveType} onChange={handleChange}>
        <option value="SIL">SIL</option>
        <option value="Vacation Leave">Vacation Leave</option>
        <option value="Sick Leave">Sick Leave</option>
      </select>

      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
        required
      />

      <textarea
        name="reason"
        placeholder="Reason"
        value={form.reason}
        onChange={handleChange}
      />

      <select name="status" value={form.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="denied">Denied</option>
      </select>

      <button type="submit">
        {editingLeave ? "Update Leave" : "Submit Leave"}
      </button>

      {editingLeave && (
        <button type="button" onClick={onCancelEdit}>
          Cancel Edit
        </button>
      )}
    </form>
  );
}

export default LeaveForm;