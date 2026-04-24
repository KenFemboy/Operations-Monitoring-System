import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    periodStart: Date,
    periodEnd: Date,

    // Earnings
    basicPay: Number,
    overtimePay: Number,
    allowances: Number,
    grossPay: Number,

    // Deductions
    lateDeduction: Number,
    undertimeDeduction: Number,
    absenceDeduction: Number,

    sss: Number,
    philhealth: Number,
    pagibig: Number,
    tax: Number,

    totalDeductions: Number,
    netPay: Number,

    // Meta
    status: {
      type: String,
      enum: ["pending", "approved", "paid"],
      default: "pending",
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    paidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);