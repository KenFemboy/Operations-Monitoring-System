// models/Employee.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    middleName: {
      type: String,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    gender: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    plantillaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plantilla",
    },
    assignedBranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    dateHired: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    governmentIds: {
      sss: {
        type: String,
        trim: true,
      },
      philhealth: {
        type: String,
        trim: true,
      },
      pagibig: {
        type: String,
        trim: true,
      },
      tin: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

employeeSchema.index({ assignedBranchId: 1, role: 1, status: 1 });
employeeSchema.index({ plantillaId: 1, status: 1 });

export default mongoose.model("Employee", employeeSchema);
