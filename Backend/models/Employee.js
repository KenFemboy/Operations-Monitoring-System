// models/Employee.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },

  personalInfo: {
    firstName: String,
    lastName: String,
    middleName: String,
    gender: String,
    birthDate: Date,
    contactNumber: String,
    email: String,
    address: String
  },

  employmentInfo: {
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position"
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },
    employmentType: {
      type: String,
      enum: ["regular", "contractual", "probationary"]
    },
    dateHired: Date,
    status: {
      type: String,
      enum: ["active", "resigned", "terminated"],
      default: "active"
    }
  },

  salaryInfo: {
    basicSalary: Number,
    payType: {
      type: String,
      enum: ["monthly", "daily", "hourly"]
    },
    allowances: Number
  },

  governmentIds: {
    sss: String,
    philhealth: String,
    pagibig: String,
    tin: String
  },

  leaveBalances: {
    vacationLeave: { type: Number, default: 0 },
    sickLeave: { type: Number, default: 0 }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);