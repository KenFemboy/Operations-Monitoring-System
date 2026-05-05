import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
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

    date: {
      type: Date,
      required: true,
    },

    timeIn: String,
    timeOut: String,

    totalHours: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late", "half-day"],
      default: "present",
    },

    remarks: String,
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);