import { useEffect, useState } from "react";

function PlantillaForm({
  branches = [],
  selectedPlantilla,
  onSubmit,
  onCancelEdit,
}) {
  const emptyForm = {
    position: "",
    branch: "",
    requiredCount: "",
    currentCount: "",
    status: "open",
  };

  const [form, setForm] = useState(emptyForm);

  const isEditing = Boolean(selectedPlantilla);

  useEffect(() => {
    if (selectedPlantilla) {
      const branchName =
        selectedPlantilla.branch?.branchName || selectedPlantilla.branch || "";

      setForm({
        position: selectedPlantilla.position || "",
        branch:
          selectedPlantilla.branch?._id ||
          branches.find((branch) => branch.branchName === branchName)?._id ||
          selectedPlantilla.branch ||
          "",
        requiredCount: selectedPlantilla.requiredCount ?? "",
        currentCount: selectedPlantilla.currentCount ?? "",
        status: selectedPlantilla.status || "open",
      });
    } else {
      setForm(emptyForm);
    }
  }, [branches, selectedPlantilla]);

  const getAutoStatus = (requiredCount, currentCount) => {
    const required = Number(requiredCount || 0);
    const current = Number(currentCount || 0);

    if (current === 0) return "open";
    if (current < required) return "understaffed";
    if (current === required) return "filled";
    if (current > required) return "overstaffed";

    return "open";
  };

  const handleChange = (e) => {
    const updatedForm = {
      ...form,
      [e.target.name]: e.target.value,
    };

    updatedForm.status = getAutoStatus(
      updatedForm.requiredCount,
      updatedForm.currentCount
    );

    setForm(updatedForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      position: form.position,
      branch: form.branch,
      branchId: form.branch,
      requiredCount: Number(form.requiredCount || 0),
      currentCount: Number(form.currentCount || 0),
      status: getAutoStatus(form.requiredCount, form.currentCount),
    });

    if (!isEditing) {
      setForm(emptyForm);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        name="position"
        placeholder="Position"
        value={form.position}
        onChange={handleChange}
        required
        style={styles.input}
      />

      <select
        name="branch"
        value={form.branch}
        onChange={handleChange}
        required
        style={styles.input}
      >
        <option value="">Select Branch</option>
        {branches.map((branch) => (
          <option key={branch._id} value={branch._id}>
            {branch.branchName} - {branch.location}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="requiredCount"
        placeholder="Required Count"
        value={form.requiredCount}
        onChange={handleChange}
        required
        min="0"
        style={styles.input}
      />

      <input
        type="number"
        name="currentCount"
        placeholder="Current Count"
        value={form.currentCount}
        onChange={handleChange}
        style={styles.input}
         min="0"
      />

      <input
        value={form.status}
        disabled
        style={{
          ...styles.input,
          backgroundColor: "#f3f4f6",
          color: "#374151",
          cursor: "not-allowed",
        }}
      />

      <button type="submit" style={styles.primaryButton}>
        {isEditing ? "Update Plantilla" : "Save Plantilla"}
      </button>

      {isEditing && (
        <button type="button" onClick={onCancelEdit} style={styles.cancelButton}>
          Cancel
        </button>
      )}
    </form>
  );

  if (isEditing) {
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modal}>
          <div style={styles.modalHeader}>
            <div>
              <h2 style={{ margin: 0 }}>Edit Plantilla</h2>
              <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
                Status is automatically calculated from required and current count.
              </p>
            </div>

            <button type="button" onClick={onCancelEdit} style={styles.closeButton}>
              ×
            </button>
          </div>

          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2>Create Plantilla</h2>
      {formContent}
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
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: "20px",
  },
  modal: {
    width: "100%",
    maxWidth: "780px",
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    gap: "16px",
  },
  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    fontSize: "28px",
    cursor: "pointer",
    lineHeight: 1,
  },
};

export default PlantillaForm;
