import { useState } from "react";

function NTEForm({ employees, onSubmit }) {
  const [form, setForm] = useState({
    employee: "",
    subject: "",
    explanation: "",
    deadline: "",
    status: "pending",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Notice to Explain</h2>

      <select name="employee" value={form.employee} onChange={handleChange} required>
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.firstName} {emp.lastName}
          </option>
        ))}
      </select>

      <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />

      <textarea
        name="explanation"
        placeholder="Employee explanation"
        value={form.explanation}
        onChange={handleChange}
      />

      <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />

      <select name="status" value={form.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="submitted">Submitted</option>
        <option value="closed">Closed</option>
      </select>

      <button type="submit">Save NTE</button>
    </form>
  );
}

export default NTEForm;