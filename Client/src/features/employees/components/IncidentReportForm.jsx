import { useState } from "react";
import BranchEmployeePicker from "./BranchEmployeePicker";

function IncidentReportForm({ employees, branches = [], useBranchPicker = false, onSubmit }) {
  const [form, setForm] = useState({
    employee: "",
    branchId: "",
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
    if (useBranchPicker && !form.employee) {
      alert("Please select an employee");
      return;
    }

    const { branchId: _branchId, ...payload } = form;
    onSubmit(payload);

    setForm({
      employee: "",
      branchId: "",
      incidentDate: "",
      title: "",
      description: "",
      actionTaken: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>Create Incident Report</h2>

      <div className="employee-form-sections">
        <section className="employee-form-section">
          <h4>Employee & Date</h4>
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

            <label className="employee-field">
              <span>Incident Date</span>
              <input
                type="date"
                name="incidentDate"
                value={form.incidentDate}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Report Details</h4>
          <div className="employee-form-grid">
            <label className="employee-field employee-field-full">
              <span>Title</span>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label className="employee-field employee-field-full">
              <span>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Action Taken</h4>
          <div className="employee-form-grid">
            <label className="employee-field employee-field-full">
              <span>Action Taken</span>
              <textarea
                name="actionTaken"
                value={form.actionTaken}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save IR
        </button>
      </div>
    </form>
  );
}

export default IncidentReportForm;
