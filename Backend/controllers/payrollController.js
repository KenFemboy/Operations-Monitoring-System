import * as payrollService from "../modules/payroll/payroll.service.js";
import Employee from "../models/Employee.js";
import Payroll from "../models/Payroll.js";
import { canAccessBranch } from "../middleware/accessControl.js";

const sendError = (res, error) =>
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Payroll request failed",
  });

const assertEmployeeAccess = async (req, employeeId) => {
  const employee = await Employee.findById(employeeId).select("assignedBranchId").lean();

  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  if (!canAccessBranch(req.user, employee.assignedBranchId)) {
    const error = new Error("Forbidden: you can only access your assigned branch");
    error.statusCode = 403;
    throw error;
  }
};

const assertPayrollAccess = async (req, payrollId) => {
  const payroll = await Payroll.findById(payrollId).select("branchId").lean();

  if (!payroll) {
    const error = new Error("Payroll not found");
    error.statusCode = 404;
    throw error;
  }

  if (!canAccessBranch(req.user, payroll.branchId)) {
    const error = new Error("Forbidden: you can only access your assigned branch");
    error.statusCode = 403;
    throw error;
  }
};

export const generatePayrollController = async (req, res) => {
  try {
    await assertEmployeeAccess(req, req.body.employeeId);
    const payroll = await payrollService.generatePayroll({
      employeeId: req.body.employeeId,
      periodStart: req.body.periodStart,
      periodEnd: req.body.periodEnd,
      generatedBy: req.user?.id,
    });

    return res.status(201).json({
      success: true,
      message: "Payroll generated successfully",
      data: payroll,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getPayrolls = async (req, res) => {
  try {
    const filter = req.branchScope?.branchId
      ? { branchId: req.branchScope.branchId }
      : {};
    const payrolls = await payrollService.getPayrolls(filter);

    return res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getEmployeePayroll = async (req, res) => {
  try {
    await assertEmployeeAccess(req, req.params.employeeId);
    const payrolls = await payrollService.getPayrollByEmployee(req.params.employeeId);

    return res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const approvePayroll = async (req, res) => {
  try {
    await assertPayrollAccess(req, req.params.id);
    const payroll = await payrollService.approvePayroll(req.params.id);
    return res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    return sendError(res, error);
  }
};

export const markAsPaid = async (req, res) => {
  try {
    await assertPayrollAccess(req, req.params.id);
    const payroll = await payrollService.markAsPaid(req.params.id);
    return res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    return sendError(res, error);
  }
};
