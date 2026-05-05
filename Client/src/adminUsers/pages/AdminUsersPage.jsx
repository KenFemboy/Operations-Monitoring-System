import { useEffect, useState } from "react";

import {
  getBranchAdmins,
  createBranchAdmin,
  updateBranchAdmin,
  deleteBranchAdmin,
  getBranches,
} from "../api/adminUserApi";

import AdminUserForm from "../components/AdminUserForm";
import AdminUserTable from "../components/AdminUserTable";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
    fetchData();
  }, []);

  const handleSubmit = async (form) => {
    try {
      setSubmitting(true);

      if (selectedUser) {
        await updateBranchAdmin(selectedUser._id, form);
        alert("Admin user updated successfully");
      } else {
        await createBranchAdmin(form);
        alert("Admin user created successfully");
      }

      setSelectedUser(null);
      await fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save admin user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    const authorizationPassword = window.prompt(
      `Enter your super admin password to delete ${user.name}:`
    );

    if (!authorizationPassword) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}? This will archive the user first.`
    );

    if (!confirmed) return;

    try {
      await deleteBranchAdmin(user._id, {
        authorizationPassword,
      });

      alert("Admin user deleted successfully");
      await fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete admin user");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Admin User Management</h1>
          <p style={styles.pageSubtitle}>
            Create, edit, delete, and assign branch admins.
          </p>
        </div>
      </div>

      {loading && <p style={styles.loading}>Loading admin users...</p>}

      <AdminUserForm
        branches={branches}
        selectedUser={selectedUser}
        onSubmit={handleSubmit}
        onCancel={() => setSelectedUser(null)}
        submitting={submitting}
      />

      <AdminUserTable
        users={users}
        onEdit={(user) => {
          setSelectedUser(user);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onDelete={handleDelete}
      />
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
};

export default AdminUsersPage;