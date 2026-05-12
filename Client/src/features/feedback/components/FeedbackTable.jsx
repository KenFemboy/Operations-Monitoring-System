import { useState } from "react";
import { deleteFeedback } from "../../../api/admin/adminFeedbackApi";

const getImageUrl = (publicPath = "") => {
  if (!publicPath) return "";

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${apiUrl}${publicPath}`;
};

function FeedbackTable({ feedbacks, onRefresh }) {
  const [previewImage, setPreviewImage] = useState(null);

  const renderStars = (rating) => {
    return "\u2605".repeat(rating) + "\u2606".repeat(5 - rating);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!confirmed) return;

    try {
      await deleteFeedback(id);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete feedback");
    }
  };

  return (
    <>
      <div style={styles.card}>
        <h2>Customer Reviews</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Branch</th>
              <th style={styles.th}>Lunch / Dinner</th>
              <th style={styles.th}>Rating</th>
              <th style={styles.th}>Review</th>
              <th style={styles.th}>Concern Photo</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {feedbacks.length === 0 ? (
              <tr>
                <td style={styles.empty} colSpan="8">
                  No customer reviews found.
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
                    {feedback.branch?.branchName || feedback.branch || "-"}
                  </td>

                  <td style={styles.td}>
                    {feedback.serviceType || feedback.mealSession}
                  </td>

                  <td style={styles.td}>
                    <span style={styles.starText}>
                      {renderStars(feedback.rating)}
                    </span>
                    <span style={styles.ratingText}> ({feedback.rating}/5)</span>
                  </td>

                  <td style={styles.td}>
                    {feedback.comment || feedback.review || "-"}
                  </td>

                  <td style={styles.td}>
                    {feedback.concernPhoto ? (
                      <button
                        type="button"
                        style={styles.thumbnailButton}
                        onClick={() =>
                          setPreviewImage(getImageUrl(feedback.concernPhoto))
                        }
                      >
                        <img
                          src={getImageUrl(feedback.concernPhoto)}
                          alt="Feedback concern"
                          style={styles.thumbnail}
                        />
                      </button>
                    ) : (
                      "No photo"
                    )}
                  </td>

                  <td style={styles.td}>
                    <button
                      type="button"
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

      {previewImage && (
        <div style={styles.modalBackdrop} onClick={() => setPreviewImage(null)}>
          <div
            style={styles.modalPanel}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              style={styles.closeButton}
              onClick={() => setPreviewImage(null)}
            >
              Close
            </button>
            <img
              src={previewImage}
              alt="Feedback concern preview"
              style={styles.previewImage}
            />
          </div>
        </div>
      )}
    </>
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
    minWidth: "1000px",
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
  thumbnailButton: {
    padding: 0,
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  thumbnail: {
    width: "90px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    backgroundColor: "rgba(15, 23, 42, 0.58)",
  },
  modalPanel: {
    position: "relative",
    maxWidth: "min(920px, 96vw)",
    maxHeight: "92vh",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "44px 16px 16px",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.3)",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "78vh",
    objectFit: "contain",
    borderRadius: "8px",
  },
  closeButton: {
    position: "absolute",
    right: "12px",
    top: "10px",
    padding: "7px 12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
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
    whiteSpace: "nowrap",
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
