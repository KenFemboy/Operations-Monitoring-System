import { useState } from "react";

function NTEForm({ employees, onSubmit }) {
  const [form, setForm] = useState({
    employee: "",
    subject: "",
    explanation: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      employee: "",
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
          <h4>Employee</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Employee</span>
              <select name="employee" value={form.employee} onChange={handleChange} required>
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeId} - {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </label>
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
    </form>
  );
}

export default NTEForm;
