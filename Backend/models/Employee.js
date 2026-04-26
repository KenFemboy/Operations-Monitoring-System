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
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    phone: String,

    position: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    employmentStatus: {
      type: String,
      enum: ["active", "inactive", "resigned", "terminated"],
      default: "active",
    },

    salaryRate: {
      type: Number,
      default: 0,
    },

    dateHired: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);