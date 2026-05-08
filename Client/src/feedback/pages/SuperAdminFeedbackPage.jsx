import { useEffect, useState } from "react";
import {
  getFeedbacks,
  getAverageRatingByBranch,
  getAverageRatingByMonth,
} from "../api/feedbackApi";

import FeedbackTable from "../components/FeedbackTable";
import FeedbackDateFilter from "../components/FeedbackDateFilter";
import AverageRatingByBranchTable from "../components/AverageRatingByBranchTable";
import AverageRatingByMonthTable from "../components/AverageRatingByMonthTable";
import { getBranches } from "../../branches/api/branchApi";

function SuperAdminFeedbackPage() {
  const [branches, setBranches] = useState([]);
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
      console.error("Failed to fetch branch summary:", err);
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

  const fetchAll = async (filter = activeFilter) => {
    await fetchBranches();
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
      <h1>Feedback Management - All Branches</h1>
      <p>View customer ratings, reviews, and performance across all branches.</p>

      <FeedbackDateFilter
        branches={branches}
        onFilter={handleFilter}
        onClear={handleClearFilter}
        showBranchFilter={true}
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

export default SuperAdminFeedbackPage;
