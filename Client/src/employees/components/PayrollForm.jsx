import { useState } from "react";

function PayrollForm({ employees, onSubmit }) {
  const [form, setForm] = useState({
    employee: "",
    payPeriodStart: "",
    payPeriodEnd: "",
    overtimePay: "",
    deductions: "",
  });

  const selectedEmployee = employees.find((emp) => emp._id === form.employee);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      overtimePay: Number(form.overtimePay || 0),
      deductions: Number(form.deductions || 0),
    });

    setForm({
      employee: "",
      payPeriodStart: "",
      payPeriodEnd: "",
      overtimePay: "",
      deductions: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>Create Payroll</h2>

      <div className="employee-form-sections">
        <section className="employee-form-section">
          <h4>Employee</h4>
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

            {selectedEmployee && (
              <p className="employee-field employee-field-full">
                Hourly Rate: ₱{Number(selectedEmployee.salaryRate || 0).toFixed(2)}
              </p>
            )}
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Pay Period</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Period Start</span>
              <input
                type="date"
                name="payPeriodStart"
                value={form.payPeriodStart}
                onChange={handleChange}
                required
              />
            </label>

            <label className="employee-field">
              <span>Period End</span>
              <input
                type="date"
                name="payPeriodEnd"
                value={form.payPeriodEnd}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Adjustments</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Overtime Pay</span>
              <input
                type="number"
                name="overtimePay"
                value={form.overtimePay}
                onChange={handleChange}
                 min="0"
              />
            </label>

            <label className="employee-field">
              <span>Deductions</span>
              <input
                type="number"
                name="deductions"
                value={form.deductions}
                onChange={handleChange}
                 min="0"
              />
            </label>
          </div>
        </section>
      </div>

      <div className="form-actions">
        <button type="submit">Generate Payroll</button>
      </div>
    </form>
  );
}

export default PayrollForm;