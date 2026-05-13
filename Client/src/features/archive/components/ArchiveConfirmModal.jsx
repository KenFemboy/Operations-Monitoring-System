import { useState } from "react";

const WARNING =
  "This record will be hidden from normal lists but can be restored by the Super Admin.";

function ArchiveConfirmModal({ isOpen, title = "Archive record", onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onConfirm(reason);
      setReason("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.backdrop} role="dialog" aria-modal="true">
      <form style={styles.modal} onSubmit={handleSubmit}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.warning}>{WARNING}</p>
        <label style={styles.label}>
          <span>Archive reason</span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Optional"
            rows={3}
            style={styles.textarea}
          />
        </label>
        <div style={styles.actions}>
          <button type="button" onClick={onClose} style={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" disabled={submitting} style={styles.archiveButton}>
            {submitting ? "Archiving..." : "Archive"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "20px",
    backgroundColor: "rgba(15, 23, 42, 0.55)",
  },
  modal: {
    width: "min(440px, 100%)",
    display: "grid",
    gap: "14px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 20px 55px rgba(15, 23, 42, 0.25)",
  },
  title: {
    margin: 0,
    fontSize: "20px",
  },
  warning: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.5,
  },
  label: {
    display: "grid",
    gap: "7px",
    fontWeight: 600,
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    font: "inherit",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  cancelButton: {
    padding: "8px 12px",
    backgroundColor: "#fff",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: "pointer",
  },
  archiveButton: {
    padding: "8px 12px",
    backgroundColor: "#b91c1c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default ArchiveConfirmModal;
