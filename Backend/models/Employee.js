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
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    positionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
    },
    assignedBranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    employmentType: {
      type: String,
      enum: ["regular", "contractual"],
    },
    dateHired: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    basicSalary: {
      type: Number,
    },
    dailyRate: {
      type: Number,
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

export default mongoose.model("Employee", employeeSchema);