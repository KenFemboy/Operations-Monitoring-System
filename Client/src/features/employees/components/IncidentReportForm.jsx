import { useState } from "react";

function IncidentReportForm({ employees, onSubmit }) {
  const [form, setForm] = useState({
    employee: "",
    incidentDate: "",
    title: "",
    description: "",
    actionTaken: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(form);

    setForm({
      employee: "",
      incidentDate: "",
      title: "",
      description: "",
      actionTaken: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>Create Incident Report</h2>

      <div className="employee-form-sections">
        <section className="employee-form-section">
          <h4>Employee & Date</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Employee</span>
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
            </label>

            <label className="employee-field">
              <span>Incident Date</span>
              <input
                type="date"
                name="incidentDate"
                value={form.incidentDate}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Report Details</h4>
          <div className="employee-form-grid">
            <label className="employee-field employee-field-full">
              <span>Title</span>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label className="employee-field employee-field-full">
              <span>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Action Taken</h4>
          <div className="employee-form-grid">
            <label className="employee-field employee-field-full">
              <span>Action Taken</span>
              <textarea
                name="actionTaken"
                value={form.actionTaken}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save IR
        </button>
      </div>
    </form>
  );
}

export default IncidentReportForm;