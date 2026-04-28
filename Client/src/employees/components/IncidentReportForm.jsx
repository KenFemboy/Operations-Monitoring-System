import { useState } from "react";

function IncidentReportForm({ employees, onSubmit }) {
  const [form, setForm] = useState({
    employee: "",
    incidentDate: "",
    title: "",
    description: "",
    actionTaken: "",
    status: "open",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>Create Incident Report</h2>

      <div className="employee-form-sections">
        <section className="employee-form-section">
          <h4>Employee & Status</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
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

            <label className="employee-field">
              <span>Status</span>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="open">Open</option>
                <option value="under-review">Under Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Incident Details</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Incident Date</span>
              <input type="date" name="incidentDate" value={form.incidentDate} onChange={handleChange} required />
            </label>
            <label className="employee-field">
              <span>Title</span>
              <input name="title" value={form.title} onChange={handleChange} required />
            </label>
            <label className="employee-field employee-field-full">
              <span>Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} required />
            </label>
            <label className="employee-field employee-field-full">
              <span>Action Taken</span>
              <textarea name="actionTaken" value={form.actionTaken} onChange={handleChange} />
            </label>
          </div>
        </section>
      </div>

      <div className="form-actions">
        <button type="submit">Save IR</button>
      </div>
    </form>
  );
}

export default IncidentReportForm;