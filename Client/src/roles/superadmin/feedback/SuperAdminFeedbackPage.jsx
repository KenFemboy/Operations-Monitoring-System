import { useEffect, useState } from "react";
import {
  getSuperAdminFeedback as getFeedbacks,
  getSuperAdminAverageRatingByBranch as getAverageRatingByBranch,
  getSuperAdminAverageRatingByMonth as getAverageRatingByMonth,
} from "../../../api/superadmin/superAdminFeedbackApi";

import FeedbackTable from "../../../features/feedback/components/FeedbackTable";
import FeedbackDateFilter from "../../../features/feedback/components/FeedbackDateFilter";
import AverageRatingByBranchTable from "../../../features/feedback/components/AverageRatingByBranchTable";
import AverageRatingByMonthTable from "../../../features/feedback/components/AverageRatingByMonthTable";
import { getBranches } from "../../../api/superadmin/superAdminBranchApi";

const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getFeedbackSlug = (branch) =>
  slugify(branch.branchName?.replace(/\s+branch$/i, "") || branch.location);

const getFeedbackPath = (branch) => `/feedback/${getFeedbackSlug(branch)}`;

function SuperAdminFeedbackPage() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [branchSummary, setBranchSummary] = useState([]);
  const [monthSummary, setMonthSummary] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const branchHues = [18, 32, 48, 88, 132, 176, 210, 238, 268, 300, 330];

  const [activeFilter, setActiveFilter] = useState({
    startDate: "",
    endDate: "",
    branch: "all",
    mealSession: "all",
  });

  const withSelectedBranch = (
    filter = activeFilter,
    branchId = selectedBranch?._id
  ) => ({
    ...filter,
    branch: branchId || filter.branch || "all",
  });

  const fetchFeedbacks = async (
    filter = activeFilter,
    branchId = selectedBranch?._id
  ) => {
    if (!branchId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await getFeedbacks(withSelectedBranch(filter, branchId));
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load customer reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchSummary = async (
    filter = activeFilter,
    branchId = selectedBranch?._id
  ) => {
    if (!branchId) {
      return;
    }

    try {
      const selectedFilter = withSelectedBranch(filter, branchId);
      const res = await getAverageRatingByBranch({
        startDate: selectedFilter.startDate,
        endDate: selectedFilter.endDate,
        branch: selectedFilter.branch,
        mealSession: selectedFilter.mealSession,
      });

      setBranchSummary(res.data.summary || []);
    } catch (err) {
      console.error("Failed to fetch branch summary:", err);
    }
  };

  const fetchMonthSummary = async (
    filter = activeFilter,
    branchId = selectedBranch?._id
  ) => {
    if (!branchId) {
      return;
    }

    try {
      const selectedFilter = withSelectedBranch(filter, branchId);
      const res = await getAverageRatingByMonth({
        startDate: selectedFilter.startDate,
        endDate: selectedFilter.endDate,
        branch: selectedFilter.branch,
        mealSession: selectedFilter.mealSession,
      });

      setMonthSummary(res.data.summary || []);
    } catch (err) {
      console.error("Failed to fetch month summary:", err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await getBranches();
      setBranches(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAll = async (
    filter = activeFilter,
    branchId = selectedBranch?._id
  ) => {
    await fetchFeedbacks(filter, branchId);
    await fetchBranchSummary(filter, branchId);
    await fetchMonthSummary(filter, branchId);
  };

  const handleFilter = async (filter) => {
    const selectedFilter = withSelectedBranch(filter);
    setActiveFilter(selectedFilter);
    await fetchAll(selectedFilter);
  };

  const handleClearFilter = async () => {
    const clearedFilter = {
      startDate: "",
      endDate: "",
      branch: selectedBranch?._id || "all",
      mealSession: "all",
    };

    setActiveFilter(clearedFilter);
    await fetchAll(clearedFilter);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchBranches();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSelectBranch = (branch) => {
    const branchFilter = {
      startDate: "",
      endDate: "",
      branch: branch._id,
      mealSession: "all",
    };

    setSelectedBranch(branch);
    setActiveFilter(branchFilter);
    setFeedbacks([]);
    setBranchSummary([]);
    setMonthSummary([]);
    fetchAll(branchFilter, branch._id);
  };

  const handleBackToBranches = () => {
    setSelectedBranch(null);
    setActiveFilter({
      startDate: "",
      endDate: "",
      branch: "all",
      mealSession: "all",
    });
    setFeedbacks([]);
    setBranchSummary([]);
    setMonthSummary([]);
  };

  return (
    <div style={styles.page}>
      <h1>Feedback Management</h1>
      <p>Select a branch to view customer ratings, reviews, and performance.</p>

      {loading && <p>Loading reviews...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!selectedBranch && (
        <section className="ops-branch-section">
          <h2>Branches</h2>
          <div className="ops-branch-grid">
            {branches.map((branch, index) => (
              <button
                key={branch._id}
                type="button"
                onClick={() => handleSelectBranch(branch)}
                className="ops-branch-card"
                aria-pressed={false}
                style={{ "--branch-hue": branchHues[index % branchHues.length] }}
              >
                <strong>{branch.branchName}</strong>
                <span>{branch.location || "No location"}</span>
                <small>{getFeedbackPath(branch)}</small>
              </button>
            ))}
          </div>
          {branches.length === 0 && !loading && <p>No branches found.</p>}
        </section>
      )}

      {selectedBranch && (
        <>
          <div style={styles.selectedBranchBar}>
            <div>
              <strong>{selectedBranch.branchName}</strong>
              <span>{selectedBranch.location || "No location"}</span>
              <small>{getFeedbackPath(selectedBranch)}</small>
            </div>
            <button
              type="button"
              onClick={handleBackToBranches}
              style={styles.backButton}
            >
              Back to Branches
            </button>
          </div>

          <FeedbackDateFilter
            onFilter={handleFilter}
            onClear={handleClearFilter}
            showBranchFilter={false}
            assignedBranchName={selectedBranch.branchName}
          />

          <div style={styles.summaryGrid}>
            <AverageRatingByBranchTable data={branchSummary} />
            <AverageRatingByMonthTable data={monthSummary} />
          </div>

          <FeedbackTable
            feedbacks={feedbacks}
            onRefresh={() => fetchAll(activeFilter)}
          />
        </>
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
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  branchSection: {
    marginTop: "20px",
  },
  branchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginTop: "12px",
  },
  branchCard: {
    display: "grid",
    gap: "6px",
    padding: "16px",
    textAlign: "left",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
  },
  selectedBranchBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "14px",
    margin: "16px 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
  },
  backButton: {
    padding: "10px 16px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
    borderRadius: "6px",
  },
};

export default SuperAdminFeedbackPage;
