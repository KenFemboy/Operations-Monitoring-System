// models/Position.js
import mongoose from "mongoose";

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },

  baseSalary: {
    type: Number,
    required: true
  },

  dailyRate: Number,

  level: {
    type: Number, // for hierarchy (1 = staff, 2 = supervisor, etc.)
    default: 1
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }

}, { timestamps: true });

// Prevent duplicate positions per department
positionSchema.index({ name: 1, departmentId: 1 }, { unique: true });

export default mongoose.model("Position", positionSchema);