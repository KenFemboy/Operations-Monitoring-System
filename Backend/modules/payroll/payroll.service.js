import Attendance from "../../models/Attendance.js";
import Employee from "../../models/Employee.js";
import Payroll from "../../models/Payroll.js";
import { assertValidObjectId } from "../../middleware/accessControl.js";
import { getEmployeeSalary } from "../plantilla/plantilla.service.js";

const ACTIVE_ATTENDANCE_STATUSES = new Set(["present", "late"]);

const toDate = (value, fieldName) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    const error = new Error(`${fieldName} must be a valid date`);
    error.statusCode = 400;
    throw error;
  }

  return date;
};

const roundMoney = (value) => Number(Number(value || 0).toFixed(2));

const summarizeAttendance = (attendanceRows) => {
  return attendanceRows.reduce(
    (summary, row) => {
      if (ACTIVE_ATTENDANCE_STATUSES.has(row.status)) {
        summary.totalWorkedDays += 1;
      }

      summary.totalLateMinutes += row.lateMinutes || 0;
      summary.totalUndertimeMinutes += row.undertimeMinutes || 0;
      summary.totalOvertimeHours += row.overtimeHours || 0;
      summary.totalAbsentDays += row.status === "absent" ? 1 : 0;

      return summary;
    },
    {
      totalWorkedDays: 0,
      totalLateMinutes: 0,
      totalUndertimeMinutes: 0,
      totalOvertimeHours: 0,
      totalAbsentDays: 0,
    }
  );
};

export const generatePayroll = async ({ employeeId, periodStart, periodEnd, generatedBy }) => {
  assertValidObjectId(employeeId, "employeeId");

  const startDate = toDate(periodStart, "periodStart");
  const endDate = toDate(periodEnd, "periodEnd");

  if (endDate < startDate) {
    const error = new Error("periodEnd must be greater than or equal to periodStart");
    error.statusCode = 400;
    throw error;
  }

  const employee = await Employee.findById(employeeId);

  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  const salary = await getEmployeeSalary(employee);
  const attendanceRows = await Attendance.find({
    employee: employee._id,
    date: { $gte: startDate, $lte: endDate },
  }).lean();

  const summary = summarizeAttendance(attendanceRows);
  const lateDeduction = salary.hourlyRate * (summary.totalLateMinutes / 60);
  const undertimeDeduction = salary.hourlyRate * (summary.totalUndertimeMinutes / 60);
  const absenceDeduction = salary.dailyRate * summary.totalAbsentDays;
  const overtimePay = salary.hourlyRate * 1.25 * summary.totalOvertimeHours;
  const grossPay = salary.baseSalary + salary.allowance + overtimePay;
  const totalDeductions = lateDeduction + undertimeDeduction + absenceDeduction;
  const netPay = grossPay - totalDeductions;

  return Payroll.findOneAndUpdate(
    {
      employeeId: employee._id,
      periodStart: startDate,
      periodEnd: endDate,
    },
    {
      employeeId: employee._id,
      employee: employee._id,
      branchId: employee.assignedBranchId,
      periodStart: startDate,
      periodEnd: endDate,
      basicPay: roundMoney(salary.baseSalary),
      allowance: roundMoney(salary.allowance),
      allowances: roundMoney(salary.allowance),
      overtimePay: roundMoney(overtimePay),
      deductions: {
        late: roundMoney(lateDeduction),
        undertime: roundMoney(undertimeDeduction),
        absence: roundMoney(absenceDeduction),
      },
      totalDeductions: roundMoney(totalDeductions),
      grossPay: roundMoney(grossPay),
      netPay: roundMoney(netPay),
      summary,
      generatedBy,
      status: "pending",
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  )
    .populate("employeeId", "employeeId firstName lastName role")
    .populate("branchId", "branchName location");
};

export const getPayrollByEmployee = async (employeeId) => {
  assertValidObjectId(employeeId, "employeeId");

  return Payroll.find({ employeeId })
    .populate("employeeId", "employeeId firstName lastName role")
    .populate("branchId", "branchName location")
    .sort({ periodStart: -1 })
    .lean();
};

export const getPayrolls = async (filter = {}) => {
  return Payroll.find(filter)
    .populate("employeeId", "employeeId firstName lastName role")
    .populate("branchId", "branchName location")
    .sort({ createdAt: -1 })
    .lean();
};

export const approvePayroll = async (id) => {
  assertValidObjectId(id, "payroll id");

  const payroll = await Payroll.findByIdAndUpdate(
    id,
    { status: "approved", approvedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!payroll) {
    const error = new Error("Payroll not found");
    error.statusCode = 404;
    throw error;
  }

  return payroll;
};

export const markAsPaid = async (id) => {
  assertValidObjectId(id, "payroll id");

  const payroll = await Payroll.findByIdAndUpdate(
    id,
    { status: "paid", paidAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!payroll) {
    const error = new Error("Payroll not found");
    error.statusCode = 404;
    throw error;
  }

  return payroll;
};
