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

      <input
        type="date"
        name="incidentDate"
        value={form.incidentDate}
        onChange={handleChange}
        required
      />

      <input
        name="title"
        placeholder="Incident Title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />

      <textarea
        name="actionTaken"
        placeholder="Action Taken"
        value={form.actionTaken}
        onChange={handleChange}
      />

      <button type="submit">Save IR</button>
    </form>
  );
}

export default IncidentReportForm;