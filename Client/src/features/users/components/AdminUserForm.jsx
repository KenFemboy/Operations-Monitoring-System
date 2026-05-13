import { useEffect, useMemo, useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  branchId: "",
  branchName: "",
  authorizationPassword: "",
};

function AdminUserForm({
  branches,
  selectedUser,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [form, setForm] = useState(emptyForm);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [createAuthorizationPassword, setCreateAuthorizationPassword] =
    useState("");

  const selectedBranch = useMemo(
    () => branches.find((branch) => branch._id === form.branchId),
    [branches, form.branchId]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (selectedUser) {
        setForm({
          name: selectedUser.name || "",
          email: selectedUser.email || "",
          password: "",
          branchId: selectedUser.branchId?._id || selectedUser.branchId || "",
          branchName:
            selectedUser.branchId?.branchName ||
            selectedUser.branchName ||
            selectedUser.branch ||
            "",
          authorizationPassword: "",
        });
        setShowCreateConfirm(false);
        setCreateAuthorizationPassword("");
        return;
      }

      setForm(emptyForm);
      setShowCreateConfirm(false);
      setCreateAuthorizationPassword("");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [selectedUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const getCleanPayload = (authorizationPassword = form.authorizationPassword) => ({
    name: form.name.trim(),
    email: form.email.trim(),
    password: form.password.trim(),
    branchId: form.branchId,
    branchName: form.branchName,
    authorizationPassword,
  });

  const validateBaseForm = () => {
    if (!form.name.trim()) {
      alert("Name is required");
      return false;
    }

    if (!form.email.trim()) {
      alert("Email is required");
      return false;
    }

    if (!selectedUser && !form.password.trim()) {
      alert("Password is required");
      return false;
    }

    if (!form.branchId) {
      alert("Branch is required");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateBaseForm()) {
      return;
    }

    if (!selectedUser) {
      setShowCreateConfirm(true);
      setCreateAuthorizationPassword("");
      return;
    }

    if (!form.authorizationPassword.trim()) {
      alert("Super admin password is required");
      return;
    }

    onSubmit(getCleanPayload());
  };

  const handleConfirmCreate = (event) => {
    event.preventDefault();

    if (!createAuthorizationPassword.trim()) {
      alert("Super admin password is required");
      return;
    }

    onSubmit(getCleanPayload(createAuthorizationPassword.trim()));
    setShowCreateConfirm(false);
    setCreateAuthorizationPassword("");
  };

  const handleBranchChange = (event) => {
    const branchId = event.target.value;
    const branch = branches.find((item) => item._id === branchId);

    setForm((current) => ({
      ...current,
      branchId,
      branchName: branch?.branchName || "",
    }));
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>
            {selectedUser ? "Edit Branch Admin" : "Create Branch Admin"}
          </h2>
          <p style={styles.subtitle}>Assign a dedicated admin to a branch.</p>
        </div>

        {selectedUser && (
          <button type="button" onClick={onCancel} style={styles.cancelButton}>
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Juan Dela Cruz"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="admin@email.com"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>
            {selectedUser ? "New Password Optional" : "Password"}
          </label>
          <input
            type="password"
            name="password"
            placeholder={selectedUser ? "Leave blank to keep password" : "Enter password"}
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Assigned Branch</label>
          <select
            name="branchId"
            value={form.branchId}
            onChange={handleBranchChange}
            style={styles.input}
          >
            <option value="">Select branch</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.branchName} - {branch.location}
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <div style={styles.field}>
            <label style={styles.label}>Super Admin Password</label>
            <input
              type="password"
              name="authorizationPassword"
              placeholder="Confirm using your password"
              value={form.authorizationPassword}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        )}

        <div style={styles.actions}>
          <button type="submit" disabled={submitting} style={styles.submitButton}>
            {submitting
              ? "Saving..."
              : selectedUser
                ? "Update Admin"
                : "Review Admin"}
          </button>
        </div>
      </form>

      {showCreateConfirm && (
        <div style={styles.backdrop} role="dialog" aria-modal="true">
          <form style={styles.modal} onSubmit={handleConfirmCreate}>
            <h3 style={styles.modalTitle}>Create this branch admin?</h3>
            <div style={styles.detailGrid}>
              <span style={styles.detailLabel}>Name</span>
              <strong>{form.name.trim()}</strong>
              <span style={styles.detailLabel}>Email</span>
              <strong>{form.email.trim()}</strong>
              <span style={styles.detailLabel}>Role</span>
              <strong>console_user</strong>
              <span style={styles.detailLabel}>Branch</span>
              <strong>{form.branchName || selectedBranch?.branchName || "-"}</strong>
              <span style={styles.detailLabel}>Location</span>
              <strong>{selectedBranch?.location || "-"}</strong>
            </div>

            <label style={styles.field}>
              <span style={styles.label}>Super Admin Password</span>
              <input
                type="password"
                value={createAuthorizationPassword}
                onChange={(event) =>
                  setCreateAuthorizationPassword(event.target.value)
                }
                placeholder="Confirm using your password"
                style={styles.input}
                autoFocus
              />
            </label>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowCreateConfirm(false)}
                style={styles.modalCancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={styles.submitButton}
              >
                {submitting ? "Creating..." : "Create Admin"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  title: {
    margin: 0,
    fontSize: "22px",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    alignItems: "end",
  },
  submitButton: {
    width: "100%",
    padding: "11px 14px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cancelButton: {
    padding: "9px 12px",
    backgroundColor: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "20px",
    backgroundColor: "rgba(15, 23, 42, 0.55)",
  },
  modal: {
    width: "min(460px, 100%)",
    display: "grid",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 20px 55px rgba(15, 23, 42, 0.25)",
  },
  modalTitle: {
    margin: 0,
    fontSize: "20px",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: "10px",
    padding: "14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },
  detailLabel: {
    color: "#64748b",
  },
  modalActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  modalCancelButton: {
    width: "100%",
    padding: "11px 14px",
    backgroundColor: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default AdminUserForm;
