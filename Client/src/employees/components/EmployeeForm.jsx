import { useState } from "react";

function EmployeeForm({ onSubmit }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    branch: "",
    salaryRate: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      salaryRate: Number(form.salaryRate),
      employmentStatus: "active",
    });

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      branch: "",
      salaryRate: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>Add Employee</h2>

      <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
      <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input name="position" placeholder="Position" value={form.position} onChange={handleChange} required />
      <input name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} required />
      <input name="salaryRate" type="number" placeholder="Salary Rate" value={form.salaryRate} onChange={handleChange} />

      <div className="form-actions">
        <button type="submit">Save Employee</button>
      </div>
    </form>
  );
}

export default EmployeeForm;