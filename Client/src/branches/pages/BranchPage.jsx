import { useEffect, useState } from "react";

import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../api/branchApi";

import BranchForm from "../components/BranchForm";
import BranchTable from "../components/BranchTable";

function BranchPage() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await getBranches();
      setBranches(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = async (form) => {
    try {
      if (selectedBranch) {
        await updateBranch(selectedBranch._id, form);
        alert("Branch updated successfully");
      } else {
        await createBranch(form);
        alert("Branch created successfully");
      }

      setSelectedBranch(null);
      fetchBranches();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save branch");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBranch(id);
      alert("Branch deleted successfully");
      fetchBranches();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete branch");
    }
  };

  return (
    <div style={styles.page}>
      <h1>Branch Management</h1>
      <p>Manage branch name, location, address, and dedicated admin.</p>

      {loading && <p>Loading branches...</p>}

      <BranchForm
        selectedBranch={selectedBranch}
        onSubmit={handleSubmit}
        onCancel={() => setSelectedBranch(null)}
      />

      <BranchTable
        branches={branches}
        onEdit={setSelectedBranch}
        onDelete={handleDelete}
      />
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
};

export default BranchPage;