import { useContext, useEffect, useState } from "react";
import {
  getAdminFeedback as getFeedbacks,
  getAdminAverageRatingByBranch as getAverageRatingByBranch,
  getAdminAverageRatingByMonth as getAverageRatingByMonth,
} from "../../../api/admin/adminFeedbackApi";

import FeedbackTable from "../../../features/feedback/components/FeedbackTable";
import FeedbackDateFilter from "../../../features/feedback/components/FeedbackDateFilter";
import AverageRatingByBranchTable from "../../../features/feedback/components/AverageRatingByBranchTable";
import AverageRatingByMonthTable from "../../../features/feedback/components/AverageRatingByMonthTable";
import { AuthContext } from "../../../auth/context/AuthContext";

function AdminFeedbackPage() {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [branchSummary, setBranchSummary] = useState([]);
  const [monthSummary, setMonthSummary] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState({
    startDate: "",
    endDate: "",
    branch: "all",
    mealSession: "all",
  });

  const fetchFeedbacks = async (filter = activeFilter) => {
    try {
      setLoading(true);
      setError("");

      const res = await getFeedbacks(filter);
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load customer reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchSummary = async (filter = activeFilter) => {
    try {
      const res = await getAverageRatingByBranch({
        startDate: filter.startDate,
        endDate: filter.endDate,
        branch: filter.branch,
        mealSession: filter.mealSession,
      });

      setBranchSummary(res.data.summary || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMonthSummary = async (filter = activeFilter) => {
    try {
      const res = await getAverageRatingByMonth({
        branch: filter.branch,
        mealSession: filter.mealSession,
      });

      setMonthSummary(res.data.summary || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAll = async (filter = activeFilter) => {
    await fetchFeedbacks(filter);
    await fetchBranchSummary(filter);
    await fetchMonthSummary(filter);
  };

  const handleFilter = async (filter) => {
    setActiveFilter(filter);
    await fetchAll(filter);
  };

  const handleClearFilter = async () => {
    const clearedFilter = {
      startDate: "",
      endDate: "",
      branch: "all",
      mealSession: "all",
    };

    setActiveFilter(clearedFilter);
    await fetchAll(clearedFilter);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchAll();
    }, 0);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.page}>
      <h1>Branch Feedback Management</h1>
      <p>View customer ratings, short reviews, and rating summaries for your assigned branch.</p>

      <FeedbackDateFilter
        onFilter={handleFilter}
        onClear={handleClearFilter}
        showBranchFilter={false}
        assignedBranchName={user?.branchName || user?.branch}
      />

      <div style={styles.summaryGrid}>
        <AverageRatingByBranchTable data={branchSummary} />
        <AverageRatingByMonthTable data={monthSummary} />
      </div>

      {loading && <p>Loading reviews...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <FeedbackTable
        feedbacks={feedbacks}
        onRefresh={() => fetchAll(activeFilter)}
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
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};

export default AdminFeedbackPage;
