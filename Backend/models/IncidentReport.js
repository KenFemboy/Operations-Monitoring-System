import mongoose from "mongoose";

const incidentReportSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    incidentDate: {
      type: Date,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    actionTaken: String,

    status: {
      type: String,
      enum: ["open", "under-review", "resolved"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("IncidentReport", incidentReportSchema);