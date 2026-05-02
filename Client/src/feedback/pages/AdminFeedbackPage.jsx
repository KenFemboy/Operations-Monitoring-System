import { useEffect, useState } from "react";
import { getFeedbacks } from "../api/feedbackApi";
import FeedbackTable from "../components/FeedbackTable";
import FeedbackDateFilter from "../components/FeedbackDateFilter";

function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const fetchFeedbacks = async (startDate = "", endDate = "") => {
    try {
      setLoading(true);
      setError("");

      const res = await getFeedbacks(startDate, endDate);
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load customer reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (startDate, endDate) => {
    setActiveFilter({ startDate, endDate });
    await fetchFeedbacks(startDate, endDate);
  };

  const handleClearFilter = async () => {
    setActiveFilter({
      startDate: "",
      endDate: "",
    });

    await fetchFeedbacks();
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div style={styles.page}>
      <h1>Feedback Management</h1>
      <p>View customer ratings and short reviews.</p>

      <FeedbackDateFilter
        onFilter={handleFilter}
        onClear={handleClearFilter}
      />

      {activeFilter.startDate && activeFilter.endDate && (
        <p style={styles.filterText}>
          Showing reviews from{" "}
          <strong>{activeFilter.startDate}</strong> to{" "}
          <strong>{activeFilter.endDate}</strong>
        </p>
      )}

      {loading && <p>Loading reviews...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <FeedbackTable feedbacks={feedbacks} onRefresh={() => fetchFeedbacks(
        activeFilter.startDate,
        activeFilter.endDate
      )} />
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
  error: {
    color: "red",
    fontWeight: "bold",
  },
  filterText: {
    backgroundColor: "#e0f2fe",
    color: "#075985",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
};

export default AdminFeedbackPage;