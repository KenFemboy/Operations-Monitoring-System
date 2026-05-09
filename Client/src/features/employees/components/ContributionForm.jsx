import { useState } from "react";

function ContributionForm({ employees, onSubmit }) {
  const [form, setForm] = useState({
    employee: "",
    month: "",
    sss: "",
    pagibig: "",
    philhealth: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const total =
    Number(form.sss || 0) +
    Number(form.pagibig || 0) +
    Number(form.philhealth || 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      sss: Number(form.sss),
      pagibig: Number(form.pagibig),
      philhealth: Number(form.philhealth),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>Record Contributions</h2>

      <div className="employee-form-sections">
        <section className="employee-form-section">
          <h4>Employee & Period</h4>
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
              <span>Month</span>
              <input name="month" value={form.month} onChange={handleChange} required />
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Contribution Amounts</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>SSS</span>
              <input type="number" name="sss" value={form.sss} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>Pag-IBIG</span>
              <input type="number" name="pagibig" value={form.pagibig} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>PhilHealth</span>
              <input type="number" name="philhealth" value={form.philhealth} onChange={handleChange} />
            </label>
            <p className="employee-field employee-field-full">
              Total Contribution: ₱{total}
            </p>
          </div>
        </section>
      </div>

      <div className="form-actions">
        <button type="submit">Save Contribution</button>
      </div>
    </form>
  );
}

export default ContributionForm;