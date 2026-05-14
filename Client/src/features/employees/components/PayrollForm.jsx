import { useState } from "react";
import BranchEmployeePicker from "./BranchEmployeePicker";

function PayrollForm({ employees, branches = [], useBranchPicker = false, onSubmit }) {
  const [form, setForm] = useState({
    employee: "",
    branchId: "",
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
    if (useBranchPicker && !form.employee) {
      alert("Please select an employee");
      return;
    }

    const { branchId: _branchId, ...payload } = form;

    onSubmit({
      ...payload,
      overtimePay: Number(form.overtimePay || 0),
      deductions: Number(form.deductions || 0),
    });

    setForm({
      employee: "",
      branchId: "",
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

            {selectedEmployee && (
              <p className="employee-field employee-field-full">
                Daily Rate: PHP {Number(selectedEmployee.basicRate ?? selectedEmployee.salaryRate ?? 0).toFixed(2)}
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
