import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    basicPay: {
      type: Number,
      default: 0,
    },
    allowance: {
      type: Number,
      default: 0,
    },
    allowances: {
      type: Number,
      default: 0,
    },
    overtimePay: {
      type: Number,
      default: 0,
    },
    deductions: {
      late: { type: Number, default: 0 },
      undertime: { type: Number, default: 0 },
      absence: { type: Number, default: 0 },
    },
    totalDeductions: {
      type: Number,
      default: 0,
    },
    grossPay: {
      type: Number,
      default: 0,
    },
    netPay: {
      type: Number,
      default: 0,
    },
    summary: {
      totalWorkedDays: { type: Number, default: 0 },
      totalLateMinutes: { type: Number, default: 0 },
      totalUndertimeMinutes: { type: Number, default: 0 },
      totalOvertimeHours: { type: Number, default: 0 },
      totalAbsentDays: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "paid"],
      default: "pending",
      index: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    paidAt: Date,
  },
  { timestamps: true }
);

payrollSchema.index(
  { employeeId: 1, periodStart: 1, periodEnd: 1 },
  { unique: true }
);
payrollSchema.index({ branchId: 1, periodStart: 1, periodEnd: 1 });

export default mongoose.model("Payroll", payrollSchema);
