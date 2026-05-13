import { useEffect, useState } from "react";

import {
  getBranchAdmins,
  createBranchAdmin,
  updateBranchAdmin,
} from "../../../api/superadmin/superAdminUserApi";
import { getBranches } from "../../../api/superadmin/superAdminBranchApi";

import AdminUserForm from "../../../features/users/components/AdminUserForm";
import AdminUserTable from "../../../features/users/components/AdminUserTable";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [usersRes, branchesRes] = await Promise.all([
        getBranchAdmins(),
        getBranches(),
      ]);

      setUsers(usersRes.data?.data || []);
      setBranches(branchesRes.data?.data || []);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load admin users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(fetchData, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleCreate = async (form) => {
    try {
      setSubmitting(true);

      await createBranchAdmin(form);
      alert("Admin user created successfully");

      await fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save admin user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (form) => {
    if (!editingUser) return;

    try {
      setSubmitting(true);

      await updateBranchAdmin(editingUser._id, form);
      alert("Admin user updated successfully");

      setEditingUser(null);
      await fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update admin user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Admin User Management</h1>
          <p style={styles.pageSubtitle}>
            Create, edit, and assign branch admins.
          </p>
        </div>
      </div>

      {loading && <p style={styles.loading}>Loading admin users...</p>}

      <AdminUserForm
        branches={branches}
        selectedUser={null}
        onSubmit={handleCreate}
        onCancel={() => {}}
        submitting={submitting}
      />

      <AdminUserTable
        users={users}
        onEdit={setEditingUser}
      />

      {editingUser && (
        <div style={styles.modalBackdrop} role="dialog" aria-modal="true">
          <section style={styles.modalPanel}>
            <AdminUserForm
              branches={branches}
              selectedUser={editingUser}
              onSubmit={handleUpdate}
              onCancel={() => setEditingUser(null)}
              submitting={submitting}
            />
          </section>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "28px",
  },
  pageSubtitle: {
    margin: "8px 0 0",
    color: "#6b7280",
  },
  loading: {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    padding: "10px 12px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "20px",
    backgroundColor: "rgba(15, 23, 42, 0.55)",
  },
  modalPanel: {
    width: "min(920px, 100%)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
};

export default AdminUsersPage;
