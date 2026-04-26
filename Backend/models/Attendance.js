// models/Attendance.js

import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
    },

    // Time logs
    timeIn: Date,
    timeOut: Date,

    // Computed metrics (store for payroll efficiency)
    totalHours: {
      type: Number,
      default: 0,
    },

    lateMinutes: {
      type: Number,
      default: 0,
    },

    undertimeMinutes: {
      type: Number,
      default: 0,
    },

    overtimeHours: {
      type: Number,
      default: 0,
    },

    // Status
    status: {
      type: String,
      enum: [
        "present",
        "absent",
        "late",
        "halfday",
        "leave",
        "holiday",
        "timed_in",
      ],
      default: "present",
    },

    // Leave reference (if applicable)
    leave: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
    },

    // Shift reference (optional but recommended)
    shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
    },

    // Manual override / corrections
    isManual: {
      type: Boolean,
      default: false,
    },

    remarks: String,
  },
  { timestamps: true }
);

// 🚀 Prevent duplicate attendance per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
attendanceSchema.index({ branchId: 1, date: 1 });

export default mongoose.model("Attendance", attendanceSchema);
