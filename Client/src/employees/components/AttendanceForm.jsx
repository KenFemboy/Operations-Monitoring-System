import { useState } from "react";

function AttendanceForm({ employees, onSubmit }) {
  const [form, setForm] = useState({
    employee: "",
    date: "",
    timeIn: "",
    timeOut: "",
    status: "present",
    remarks: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSubmit = (e) => {
  e.preventDefault();

  onSubmit({
    ...form,
    date: form.date,
  });

  setForm({
    employee: "",
    date: "",
    timeIn: "",
    timeOut: "",
    status: "present",
    remarks: "",
  });
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Record Attendance</h2>

      <select name="employee" value={form.employee} onChange={handleChange} required>
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.firstName} {emp.lastName}
          </option>
        ))}
      </select>

      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input type="time" name="timeIn" value={form.timeIn} onChange={handleChange} />
      <input type="time" name="timeOut" value={form.timeOut} onChange={handleChange} />

      <select name="status" value={form.status} onChange={handleChange}>
        <option value="present">Present</option>
        <option value="absent">Absent</option>
        <option value="late">Late</option>
        <option value="half-day">Half-Day</option>
      </select>

      <textarea name="remarks" placeholder="Remarks" value={form.remarks} onChange={handleChange} />

      <button type="submit">Save Attendance</button>
    </form>
  );
}

export default AttendanceForm;