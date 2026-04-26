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
    <form onSubmit={handleSubmit}>
      <h2>Create Payroll</h2>

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

      {selectedEmployee && (
        <p>
          Hourly Rate: ₱{Number(selectedEmployee.salaryRate || 0).toFixed(2)}
        </p>
      )}

      <input
        type="date"
        name="payPeriodStart"
        value={form.payPeriodStart}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="payPeriodEnd"
        value={form.payPeriodEnd}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="overtimePay"
        placeholder="Overtime Pay"
        value={form.overtimePay}
        onChange={handleChange}
      />

      <input
        type="number"
        name="deductions"
        placeholder="Deductions"
        value={form.deductions}
        onChange={handleChange}
      />

      <button type="submit">Generate Payroll</button>
    </form>
  );
}

export default PayrollForm;