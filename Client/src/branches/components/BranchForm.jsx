import { useEffect, useState } from "react";

function BranchForm({ selectedBranch, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    branchName: "",
    location: "",
    address: "",
    dedicatedAdmin: "",
    status: "active",
  });

  useEffect(() => {
    if (selectedBranch) {
      setForm({
        branchName: selectedBranch.branchName || "",
        location: selectedBranch.location || "",
        address: selectedBranch.address || "",
        dedicatedAdmin: selectedBranch.dedicatedAdmin?._id || "",
        status: selectedBranch.status || "active",
      });
    }
  }, [selectedBranch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);

    if (!selectedBranch) {
      setForm({
        branchName: "",
        location: "",
        address: "",
        dedicatedAdmin: "",
        status: "active",
      });
    }
  };

  return (
    <div style={styles.card}>
      <h2>{selectedBranch ? "Edit Branch" : "Add Branch"}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Branch Name"
          value={form.branchName}
          onChange={(e) => setForm({ ...form, branchName: e.target.value })}
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Dedicated Admin ID"
          value={form.dedicatedAdmin}
          onChange={(e) =>
            setForm({ ...form, dedicatedAdmin: e.target.value })
          }
          style={styles.input}
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          style={styles.input}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button type="submit" style={styles.primaryButton}>
          {selectedBranch ? "Update Branch" : "Create Branch"}
        </button>

        {selectedBranch && (
          <button type="button" onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "24px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  primaryButton: {
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px",
    backgroundColor: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default BranchForm;