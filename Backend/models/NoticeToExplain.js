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
  },
  { timestamps: true }
);

export default mongoose.model("NoticeToExplain", noticeToExplainSchema);