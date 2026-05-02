import { useEffect, useState } from "react";

function EmployeeForm({ onSubmit, selectedEmployee, onCancelEdit }) {
  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    assignedBranch: "",
    salaryRate: "",
    sssId: "",
    gsisId: "",
    pagibigId: "",
    philhealthId: "",
  };

  const [form, setForm] = useState(emptyForm);

  const isEditing = Boolean(selectedEmployee);

  useEffect(() => {
    if (selectedEmployee) {
      setForm({
        firstName: selectedEmployee.firstName || "",
        lastName: selectedEmployee.lastName || "",
        email: selectedEmployee.email || "",
        phone: selectedEmployee.phone || "",
        position: selectedEmployee.position || "",
        assignedBranch:
          selectedEmployee.assignedBranch || selectedEmployee.branch || "",
        salaryRate: selectedEmployee.salaryRate ?? "",
        sssId: selectedEmployee.sssId || "",
        gsisId: selectedEmployee.gsisId || "",
        pagibigId: selectedEmployee.pagibigId || "",
        philhealthId: selectedEmployee.philhealthId || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [selectedEmployee]);

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
      salaryRate: Number(form.salaryRate || 0),
    });

    if (!isEditing) {
      setForm(emptyForm);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formCard}>
      <h2>{isEditing ? "Edit Employee" : "Add Employee"}</h2>

      <div style={styles.grid}>
        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="assignedBranch"
          placeholder="Assigned Branch"
          value={form.assignedBranch}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="number"
          name="salaryRate"
          placeholder="Base Salary / Hourly Rate"
          value={form.salaryRate}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="sssId"
          placeholder="SSS ID"
          value={form.sssId}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="gsisId"
          placeholder="GSIS ID"
          value={form.gsisId}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="pagibigId"
          placeholder="Pag-IBIG ID"
          value={form.pagibigId}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="philhealthId"
          placeholder="PhilHealth ID"
          value={form.philhealthId}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.actions}>
        <button type="submit" style={styles.primaryButton}>
          {isEditing ? "Update Employee" : "Save Employee"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

const styles = {
  formCard: {
    marginBottom: "24px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  actions: {
    marginTop: "14px",
    display: "flex",
    gap: "10px",
  },
  primaryButton: {
    padding: "10px 14px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 14px",
    backgroundColor: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default EmployeeForm;