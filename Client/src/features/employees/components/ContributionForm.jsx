import { useState } from "react";
import BranchEmployeePicker from "./BranchEmployeePicker";

function ContributionForm({ employees, branches = [], useBranchPicker = false, onSubmit }) {
  const [form, setForm] = useState({
    employee: "",
    branchId: "",
    month: "",
    sss: "",
    pagibig: "",
    philhealth: "",
  });

  const selectedEmployee = employees.find((emp) => emp._id === form.employee);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const total =
    Number(form.sss || 0) +
    Number(form.pagibig || 0) +
    Number(form.philhealth || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (useBranchPicker && !form.employee) {
      alert("Please select an employee");
      return;
    }

    const { branchId: _branchId, ...payload } = form;

    onSubmit({
      ...payload,
      sss: Number(form.sss),
      pagibig: Number(form.pagibig),
      philhealth: Number(form.philhealth),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>Record Contributions</h2>

      <div className="employee-form-sections">
        <section className="employee-form-section">
          <h4>Employee & Period</h4>
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
              <span>Month</span>
              <input type="month" name="month" value={form.month} onChange={handleChange} required />
            </label>

            {selectedEmployee && (
              <p className="employee-field employee-field-full">
                TIN ID: {selectedEmployee.tin || "-"}
              </p>
            )}
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Contribution Amounts</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>SSS</span>
              <input type="number" name="sss" value={form.sss} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>Pag-IBIG</span>
              <input type="number" name="pagibig" value={form.pagibig} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>PhilHealth</span>
              <input type="number" name="philhealth" value={form.philhealth} onChange={handleChange} />
            </label>
            <p className="employee-field employee-field-full">
              Total Contribution: PHP {total.toFixed(2)}
            </p>
          </div>
        </section>
      </div>

      <div className="form-actions">
        <button type="submit">Save Contribution</button>
      </div>
    </form>
  );
}

export default ContributionForm;
