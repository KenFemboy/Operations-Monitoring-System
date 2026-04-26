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
    <form onSubmit={handleSubmit}>
      <h2>Record Contributions</h2>

      <select name="employee" value={form.employee} onChange={handleChange} required>
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.firstName} {emp.lastName}
          </option>
        ))}
      </select>

      <input name="month" placeholder="Example: April 2026" value={form.month} onChange={handleChange} required />
      <input type="number" name="sss" placeholder="SSS" value={form.sss} onChange={handleChange} />
      <input type="number" name="pagibig" placeholder="Pag-IBIG" value={form.pagibig} onChange={handleChange} />
      <input type="number" name="philhealth" placeholder="PhilHealth" value={form.philhealth} onChange={handleChange} />

      <h3>Total Contribution: ₱{total}</h3>

      <button type="submit">Save Contribution</button>
    </form>
  );
}

export default ContributionForm;