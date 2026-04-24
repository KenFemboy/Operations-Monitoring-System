import Payroll from "../../models/Payroll.js";
import Employee from "../../models/Employee.js";
import Attendance from "../../models/Attendance.js";

import {
  computeRates,
  computeEarnings,
  computeDeductions,
  computeContributions,
  computeTax,
} from "./payroll.utils.js";

export const generatePayroll = async (startDate, endDate, userId) => {
  const employees = await Employee.find();

  const results = [];

  for (const emp of employees) {
    const attendance = await Attendance.find({
      employee: emp._id,
      date: { $gte: startDate, $lte: endDate },
    });

    const metrics = computeMetrics(attendance);

    const rates = computeRates(emp);

    const earnings = computeEarnings(metrics, rates, emp);

    const deductions = computeDeductions(metrics, rates);

    const contributions = computeContributions(emp.basicSalary);

    const tax = computeTax(earnings.grossPay);

    const totalDeductions =
      deductions.lateDeduction +
      deductions.undertimeDeduction +
      deductions.absenceDeduction +
      contributions.sss +
      contributions.philhealth +
      contributions.pagibig +
      tax;

    const netPay = earnings.grossPay - totalDeductions;

    const payroll = await Payroll.create({
      employee: emp._id,
      periodStart: startDate,
      periodEnd: endDate,

      ...earnings,
      ...deductions,
      ...contributions,

      tax,
      totalDeductions,
      netPay,

      generatedBy: userId,
    });

    results.push(payroll);
  }

  return results;
};

// helper (can move to utils)
const computeMetrics = (attendance) => {
  let daysWorked = 0;
  let lateMinutes = 0;
  let undertimeMinutes = 0;
  let overtimeHours = 0;

  attendance.forEach((a) => {
    if (a.status === "present") daysWorked++;

    lateMinutes += a.lateMinutes || 0;
    undertimeMinutes += a.undertimeMinutes || 0;
    overtimeHours += a.overtimeHours || 0;
  });

  const absentDays = attendance.filter(a => a.status === "absent").length;

  return {
    daysWorked,
    lateMinutes,
    undertimeMinutes,
    overtimeHours,
    absentDays,
  };
};