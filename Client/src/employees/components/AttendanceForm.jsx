import { useState } from "react";

function AttendanceForm({ employees, onSubmit }) {
  const getToday = () => new Date().toISOString().split("T")[0];
  const getNowTime = () => new Date().toTimeString().slice(0, 5);
  const [form, setForm] = useState({
    employee: "",
    date: getToday(),
    timeIn: getNowTime(),
    timeOut: getNowTime(),
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
    date: getToday(),
    timeIn: getNowTime(),
    timeOut: getNowTime(),
    status: "present",
    remarks: "",
  });
};

  return (
    <form onSubmit={handleSubmit} className="attendance-form">
      <div className="attendance-form-header">
        <div>
          <p className="attendance-eyebrow">Attendance</p>
          <h2>Record Attendance</h2>
          <p className="attendance-form-help">
            Log time in, time out, and status for each employee.
          </p>
        </div>
        <button type="submit" className="btn btn-primary">
          Save Attendance
        </button>
      </div>

      <div className="attendance-form-sections">
        <section className="attendance-section">
          <h4>Employee & Status</h4>
          <div className="attendance-section-grid">
            <label className="attendance-field">
              <span>Employee</span>
              <select name="employee" value={form.employee} onChange={handleChange} required>
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </label>

            <label className="attendance-field">
              <span>Status</span>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half-day">Half-Day</option>
              </select>
            </label>

            <label className="attendance-field attendance-field-full">
              <span>Remarks</span>
              <textarea
                name="remarks"
                placeholder="Add notes or reason (optional)"
                value={form.remarks}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>

        <section className="attendance-section">
          <h4>Date & Time</h4>
          <div className="attendance-section-grid">
            <label className="attendance-field">
              <span>Date</span>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </label>

            <label className="attendance-field">
              <span>Time in</span>
              <input type="time" name="timeIn" value={form.timeIn} onChange={handleChange} />
            </label>

            <label className="attendance-field">
              <span>Time out</span>
              <input type="time" name="timeOut" value={form.timeOut} onChange={handleChange} />
            </label>
          </div>
        </section>
      </div>
    </form>
  );
}

export default AttendanceForm;