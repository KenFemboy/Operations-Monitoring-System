import { useEffect, useState } from "react";
import {
  createPublicFeedback as createFeedback,
  getPublicFeedbackFormConfig,
} from "../../../api/public/feedbackPublicApi";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 50 * 1024 * 1024;

const validateImageFile = (file) => {
  if (!file) return "";

  if (!IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG, and WEBP images are allowed";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be 50MB or smaller";
  }

  return "";
};

function CustomerFeedbackForm({ branchSlug = "" }) {
  const [branch, setBranch] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    serviceType: "",
    rating: 0,
    comment: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBranch = async () => {
      if (!branchSlug) {
        setMessage("Please use the feedback QR code for your branch.");
        return;
      }

      try {
        const res = await getPublicFeedbackFormConfig(branchSlug);
        setBranch(res.data.data || null);
      } catch (err) {
        console.error(err);
        setMessage("Unable to load this feedback branch right now.");
      }
    };

    fetchBranch();
  }, [branchSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!branch?._id) {
      alert("Feedback branch is not available");
      return;
    }

    if (!form.serviceType) {
      alert("Please select lunch or dinner");
      return;
    }

    if (form.rating === 0) {
      alert("Please select a star rating");
      return;
    }

    if (form.comment.length > 120) {
      alert("Comment must be 120 characters or less");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("branch", branch._id);
      formData.append("serviceType", form.serviceType);
      formData.append("rating", form.rating);
      formData.append("comment", form.comment);
      formData.append("customerName", form.customerName || "Anonymous");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createFeedback(formData, branchSlug);

      setMessage("Thank you for your feedback!");

      setForm({
        customerName: "",
        serviceType: "",
        rating: 0,
        comment: "",
      });
      setImageFile(null);
      setFileInputKey((current) => current + 1);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit feedback");
    }
  };

  return (
    <div style={styles.card}>
      <h2>Customer Feedback</h2>
      <p style={styles.subtitle}>
        {branch
          ? `Rate your dining experience at ${branch.branchName}.`
          : "Rate your dining experience."}
      </p>

      {message && <p style={styles.success}>{message}</p>}

      {branch && (
        <div style={styles.branchBox}>
          <strong>{branch.branchName}</strong>
          <span>{branch.location || branch.address || ""}</span>
        </div>
      )}

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

        <select
          value={form.serviceType}
          onChange={(e) =>
            setForm({ ...form, serviceType: e.target.value })
          }
          required
          style={styles.input}
          name="serviceType"
        >
          <option value="">Select Lunch / Dinner</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>

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
                  {"\u2605"}
                </button>
              );
            })}
          </div>
        </div>

        <textarea
          placeholder="Short comment (optional)..."
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          maxLength="120"
          style={styles.textarea}
          name="comment"
        />

        <p style={styles.counter}>{form.comment.length}/120 characters</p>

        <input
          key={fileInputKey}
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0] || null;
            const validationError = validateImageFile(selectedFile);

            if (validationError) {
              alert(validationError);
              setImageFile(null);
              setFileInputKey((current) => current + 1);
              return;
            }

            setImageFile(selectedFile);
          }}
          style={styles.input}
        />

        <button type="submit" style={styles.primaryButton}>
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: "520px",
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
  branchBox: {
    display: "grid",
    gap: "4px",
    padding: "12px",
    marginBottom: "16px",
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    color: "#1e3a8a",
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
