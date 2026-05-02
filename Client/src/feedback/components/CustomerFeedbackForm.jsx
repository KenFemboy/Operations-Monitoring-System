import { useState } from "react";
import { createFeedback } from "../api/feedbackApi";

function CustomerFeedbackForm() {
  const [form, setForm] = useState({
    customerName: "",
    rating: 0,
    review: "",
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.rating === 0) {
      alert("Please select a star rating");
      return;
    }

    if (form.review.length > 120) {
      alert("Review must be 120 characters or less");
      return;
    }

    try {
      await createFeedback({
        customerName: form.customerName || "Anonymous",
        rating: form.rating,
        review: form.review,
      });

      setMessage("Thank you for your feedback!");

      setForm({
        customerName: "",
        rating: 0,
        review: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit feedback");
    }
  };

  return (
    <div style={styles.card}>
      <h2>Customer Feedback</h2>
      <p style={styles.subtitle}>Rate your dining experience.</p>

      {message && <p style={styles.success}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Your Name (optional)"
          value={form.customerName}
          onChange={(e) =>
            setForm({ ...form, customerName: e.target.value })
          }
          style={styles.input}
        />

        <div>
          <label style={styles.label}>Rating</label>

          <div style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= (hoverRating || form.rating);

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    ...styles.starButton,
                    color: active ? "#f59e0b" : "#d1d5db",
                  }}
                >
                  ★
                </button>
              );
            })}
          </div>
        </div>

        <textarea
          placeholder="Short review only..."
          value={form.review}
          onChange={(e) => setForm({ ...form, review: e.target.value })}
          maxLength="120"
          required
          style={styles.textarea}
        />

        <p style={styles.counter}>{form.review.length}/120 characters</p>

        <button type="submit" style={styles.primaryButton}>
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: "500px",
    margin: "40px auto",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    fontFamily: "Arial, sans-serif",
  },
  subtitle: {
    color: "#666",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  textarea: {
    minHeight: "90px",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    resize: "vertical",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "bold",
  },
  stars: {
    display: "flex",
    gap: "6px",
  },
  starButton: {
    background: "none",
    border: "none",
    fontSize: "34px",
    cursor: "pointer",
    padding: "0",
  },
  counter: {
    fontSize: "13px",
    color: "#666",
    marginTop: "-8px",
  },
  primaryButton: {
    padding: "12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  success: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "10px",
    borderRadius: "8px",
  },
};

export default CustomerFeedbackForm;