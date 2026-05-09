import { useEffect, useState } from "react";

function AdminUserForm({
    branches,
    selectedUser,
    onSubmit,
    onCancel,
    submitting,
}) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        branchId: "",
branchName: "",
        authorizationPassword: "",
    });

useEffect(() => {
  if (selectedUser) {
    setForm({
      name: selectedUser.name || "",
      email: selectedUser.email || "",
      password: "",
      branchId:
        selectedUser.branchId?._id ||
        selectedUser.branchId ||
        "",
      branchName:
        selectedUser.branchId?.branchName ||
        selectedUser.branchName ||
        selectedUser.branch ||
        "",
      authorizationPassword: "",
    });
  } else {
    setForm({
      name: "",
      email: "",
      password: "",
      branchId: "",
      branchName: "",
      authorizationPassword: "",
    });
  }
}, [selectedUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("Name is required");
            return;
        }

        if (!form.email.trim()) {
            alert("Email is required");
            return;
        }

        if (!selectedUser && !form.password.trim()) {
            alert("Password is required");
            return;
        }

        if (!form.branchId) {
  alert("Branch is required");
  return;
}

        if (!form.authorizationPassword.trim()) {
            alert("Super admin password is required");
            return;
        }

        onSubmit({
  name: form.name.trim(),
  email: form.email.trim(),
  password: form.password.trim(),
  branchId: form.branchId,
  branchName: form.branchName,
  authorizationPassword: form.authorizationPassword,
});
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>
                        {selectedUser ? "Edit Branch Admin" : "Create Branch Admin"}
                    </h2>
                    <p style={styles.subtitle}>
                        Assign a dedicated admin to a branch.
                    </p>
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
                        placeholder={
                            selectedUser ? "Leave blank to keep password" : "Enter password"
                        }
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
  onChange={(e) => {
    const selectedBranch = branches.find(
      (branch) => branch._id === e.target.value
    );

    setForm({
      ...form,
      branchId: e.target.value,
      branchName: selectedBranch?.branchName || "",
    });
  }}
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

                <div style={styles.actions}>
                    <button type="submit" disabled={submitting} style={styles.submitButton}>
                        {submitting
                            ? "Saving..."
                            : selectedUser
                                ? "Update Admin"
                                : "Create Admin"}
                    </button>
                </div>
            </form>
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
};

export default AdminUserForm;