import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    assignedBranch: {
      type: String,
      required: true,
      trim: true,
    },

    salaryRate: {
      type: Number,
      default: 0,
    },

    sssId: {
      type: String,
      trim: true,
    },

    gsisId: {
      type: String,
      trim: true,
    },

    pagibigId: {
      type: String,
      trim: true,
    },

    philhealthId: {
      type: String,
      trim: true,
    },

    employmentStatus: {
      type: String,
      enum: ["active", "inactive", "resigned", "terminated"],
      default: "active",
    },

    dateHired: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);