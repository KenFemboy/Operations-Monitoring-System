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
    <form onSubmit={handleSubmit}>
      <h2>Create Incident Report</h2>

      <select name="employee" value={form.employee} onChange={handleChange} required>
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.firstName} {emp.lastName}
          </option>
        ))}
      </select>

      <input type="date" name="incidentDate" value={form.incidentDate} onChange={handleChange} required />
      <input name="title" placeholder="Incident Title" value={form.title} onChange={handleChange} required />

      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
      <textarea name="actionTaken" placeholder="Action Taken" value={form.actionTaken} onChange={handleChange} />

      <select name="status" value={form.status} onChange={handleChange}>
        <option value="open">Open</option>
        <option value="under-review">Under Review</option>
        <option value="resolved">Resolved</option>
      </select>

      <button type="submit">Save IR</button>
    </form>
  );
}

export default IncidentReportForm;