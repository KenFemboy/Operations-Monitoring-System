import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema(
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

    month: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}$/, "Month must use YYYY-MM format"],
    },

    sss: {
      type: Number,
      default: 0,
    },

    pagibig: {
      type: Number,
      default: 0,
    },

    philhealth: {
      type: Number,
      default: 0,
    },

    totalContribution: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contribution", contributionSchema);
