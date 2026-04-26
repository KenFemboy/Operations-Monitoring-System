import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    payPeriodStart: {
      type: Date,
      required: true,
    },

    payPeriodEnd: {
      type: Date,
      required: true,
    },

    hourlyRate: {
      type: Number,
      default: 0,
    },

    totalHoursWorked: {
      type: Number,
      default: 0,
    },

    basicPay: {
      type: Number,
      default: 0,
    },

    overtimePay: {
      type: Number,
      default: 0,
    },

    deductions: {
      type: Number,
      default: 0,
    },

    netPay: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    },
  },
  { timestamps: true }
);

payrollSchema.index(
  { employee: 1, payPeriodStart: 1, payPeriodEnd: 1 },
  { unique: true }
);

export default mongoose.model("Payroll", payrollSchema);