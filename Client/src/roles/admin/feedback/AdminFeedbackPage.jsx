import { useContext, useEffect, useState } from "react";
import { getAdminFeedback as getFeedbacks } from "../../../api/admin/adminFeedbackApi";

import FeedbackTable from "../../../features/feedback/components/FeedbackTable";
import FeedbackDateFilter from "../../../features/feedback/components/FeedbackDateFilter";
import AverageRatingByMonthTable from "../../../features/feedback/components/AverageRatingByMonthTable";
import { AuthContext } from "../../../auth/context/AuthContext";

const buildMonthSummary = (feedbacks = []) => {
  const summaryByMonth = feedbacks.reduce((summary, feedback) => {
    const createdAt = feedback.createdAt ? new Date(feedback.createdAt) : null;
    const rating = Number(feedback.rating);

    if (!createdAt || Number.isNaN(createdAt.getTime()) || Number.isNaN(rating)) {
      return summary;
    }

    const year = createdAt.getFullYear();
    const month = createdAt.getMonth() + 1;
    const key = `${year}-${month}`;
    const current = summary.get(key) || {
      year,
      month,
      ratingTotal: 0,
      totalReviews: 0,
    };

    current.ratingTotal += rating;
    current.totalReviews += 1;
    summary.set(key, current);

    return summary;
  }, new Map());

  return Array.from(summaryByMonth.values())
    .map((item) => ({
      year: item.year,
      month: item.month,
      averageRating: Number((item.ratingTotal / item.totalReviews).toFixed(2)),
      totalReviews: item.totalReviews,
    }))
    .sort((a, b) => b.year - a.year || b.month - a.month);
};

function AdminFeedbackPage() {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
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
      const nextFeedbacks = res.data.feedbacks || [];

      setFeedbacks(nextFeedbacks);
      setMonthSummary(buildMonthSummary(nextFeedbacks));
    } catch (err) {
      console.error(err);
      setError("Failed to load customer reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = async (filter = activeFilter) => {
    await fetchFeedbacks(filter);
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
