import { useEffect, useState } from "react";
import {
  createPublicFeedback as createFeedback,
  getPublicFeedbackFormConfig,
} from "../../../api/public/feedbackPublicApi";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 50 * 1024 * 1024;
const SUBMITTED_KEY_PREFIX = "customer-feedback-submitted";

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

const getSubmittedKey = (branchSlug, branchId) =>
  `${SUBMITTED_KEY_PREFIX}:${branchSlug || branchId || "default"}`;

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
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBranch = async () => {
      if (!branchSlug) {
        setMessage("Please use the feedback QR code for your branch.");
        return;
      }

      try {
        const res = await getPublicFeedbackFormConfig(branchSlug);
        const feedbackBranch = res.data.data || null;
        setBranch(feedbackBranch);

        const submittedKey = getSubmittedKey(branchSlug, feedbackBranch?._id);
        setHasSubmitted(localStorage.getItem(submittedKey) === "true");
      } catch (err) {
        console.error(err);
        setMessage("Unable to load this feedback branch right now.");
      }
    };

    fetchBranch();
  }, [branchSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasSubmitted || isSubmitting) {
      return;
    }

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
      setIsSubmitting(true);
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

      localStorage.setItem(getSubmittedKey(branchSlug, branch._id), "true");
      setHasSubmitted(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasSubmitted) {
    return (
      <div style={{ ...styles.card, ...styles.thankYouCard }}>
        <div style={styles.thankYouIcon}>{"\u2713"}</div>
        <h2 style={styles.thankYouTitle}>Thank you for your feedback</h2>
        {branch && (
          <p style={styles.thankYouText}>
            Your response for {branch.branchName} has been submitted.
          </p>
        )}
      </div>
    );
  }

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
          <span style={styles.branchLabel}>Branch</span>
          <strong style={styles.branchName}>{branch.branchName}</strong>
          {(branch.location || branch.address) && (
            <span style={styles.branchLocation}>
              {branch.location || branch.address}
            </span>
          )}
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

        <div>
          <label style={styles.label}>Meal</label>
          <div style={styles.mealButtons}>
            {["Lunch", "Dinner"].map((meal) => {
              const selected = form.serviceType === meal;

              return (
                <button
                  key={meal}
                  type="button"
                  onClick={() => setForm({ ...form, serviceType: meal })}
                  style={{
                    ...styles.mealButton,
                    ...(selected ? styles.mealButtonSelected : {}),
                  }}
                  aria-pressed={selected}
                >
                  {meal}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={styles.label}>How would you rate your experience</label>

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

        <div style={styles.photoSection}>
          <label style={styles.label}>
            If you have any concern you can add a photo
          </label>
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
        </div>

        <button
          type="submit"
          style={styles.primaryButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
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
    gap: "6px",
    padding: "16px",
    marginBottom: "18px",
    backgroundColor: "#f0f9ff",
    border: "2px solid #38bdf8",
    borderRadius: "8px",
    color: "#0c4a6e",
  },
  branchLabel: {
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  branchName: {
    fontSize: "22px",
    lineHeight: "1.2",
  },
  branchLocation: {
    color: "#0369a1",
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
  mealButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  mealButton: {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#334155",
    cursor: "pointer",
    fontWeight: "bold",
  },
  mealButtonSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
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
  photoSection: {
    display: "grid",
    gap: "8px",
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
  thankYouCard: {
    textAlign: "center",
  },
  thankYouIcon: {
    width: "54px",
    height: "54px",
    margin: "0 auto 14px",
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontSize: "30px",
    fontWeight: "bold",
  },
  thankYouTitle: {
    marginBottom: "8px",
  },
  thankYouText: {
    color: "#475569",
    margin: 0,
  },
  success: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "10px",
    borderRadius: "8px",
  },
};

export default CustomerFeedbackForm;
