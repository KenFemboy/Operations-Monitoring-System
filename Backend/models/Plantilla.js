import mongoose from "mongoose";

const plantillaSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
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
      required: true,
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
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

plantillaSchema.index({ branchId: 1, role: 1 }, { unique: true });
plantillaSchema.index({ status: 1, branchId: 1 });

export default mongoose.model("Plantilla", plantillaSchema);
