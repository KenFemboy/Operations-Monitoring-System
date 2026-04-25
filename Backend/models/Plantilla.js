// models/Plantilla.js
import mongoose from "mongoose";

const plantillaSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    baseSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    allowance: {
      type: Number,
      default: 0,
      min: 0,
    },
    requiredCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    filledCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for unique combination of branch and role
plantillaSchema.index({ branchId: 1, role: 1 }, { unique: true });

export default mongoose.model("Plantilla", plantillaSchema);
