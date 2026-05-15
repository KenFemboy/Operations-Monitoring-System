import mongoose from "mongoose";

const noticeToExplainSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    subject: {
      type: String,
      required: true,
    },

    explanation: String,

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "submitted", "closed"],
      default: "pending",
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },

    archivedAt: {
      type: Date,
      default: null,
    },

    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    archiveReason: {
      type: String,
      default: "",
    },

    restoredAt: {
      type: Date,
      default: null,
    },

    restoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("NoticeToExplain", noticeToExplainSchema);
