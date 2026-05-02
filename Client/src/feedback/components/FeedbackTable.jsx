import { deleteFeedback } from "../api/feedbackApi";

function FeedbackTable({ feedbacks, onRefresh }) {
  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeedback(id);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete feedback");
    }
  };

  return (
    <div style={styles.card}>
      <h2>Customer Reviews</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Rating</th>
            <th style={styles.th}>Review</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {feedbacks.length === 0 ? (
            <tr>
              <td style={styles.empty} colSpan="5">
                No customer reviews yet.
              </td>
            </tr>
          ) : (
            feedbacks.map((feedback) => (
              <tr key={feedback._id}>
                <td style={styles.td}>
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </td>

                <td style={styles.td}>{feedback.customerName}</td>

                <td style={styles.td}>
                  <span style={styles.starText}>
                    {renderStars(feedback.rating)}
                  </span>
                  <span style={styles.ratingText}> ({feedback.rating}/5)</span>
                </td>

                <td style={styles.td}>{feedback.review}</td>

                <td style={styles.td}>
                  <button
                    onClick={() => handleDelete(feedback._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },
  th: {
    borderBottom: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#f9fafb",
  },
  td: {
    borderBottom: "1px solid #eee",
    padding: "12px",
    verticalAlign: "top",
  },
  empty: {
    padding: "20px",
    textAlign: "center",
    color: "#666",
  },
  starText: {
    color: "#f59e0b",
    fontSize: "18px",
    letterSpacing: "2px",
  },
  ratingText: {
    color: "#555",
    fontSize: "13px",
  },
  deleteButton: {
    padding: "6px 10px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default FeedbackTable;