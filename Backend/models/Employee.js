// models/Employee.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
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
    role: {
      type: String,
      required: true,
      trim: true,
    },
    assignedBranch: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "retired"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);