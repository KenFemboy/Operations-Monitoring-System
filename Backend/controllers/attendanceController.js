import * as attendanceService from "../modules/attendance/attendance.service.js";
import Employee from "../models/Employee.js";
import { canAccessBranch } from "../middleware/accessControl.js";

const sendError = (res, error) =>
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Attendance request failed",
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

export const timeIn = async (req, res) => {
  try {
    await assertEmployeeAccess(req, req.body.employeeId);
    const attendance = await attendanceService.timeIn({
      employeeId: req.body.employeeId,
      timestamp: req.body.timestamp,
    });

    return res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    return sendError(res, error);
  }
};

export const timeOut = async (req, res) => {
  try {
    await assertEmployeeAccess(req, req.body.employeeId);
    const attendance = await attendanceService.timeOut({
      employeeId: req.body.employeeId,
      timestamp: req.body.timestamp,
    });

    return res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getAttendanceByEmployee = async (req, res) => {
  try {
    await assertEmployeeAccess(req, req.params.employeeId);
    const rows = await attendanceService.getAttendanceByEmployee(req.params.employeeId);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getMonthlyAttendanceSummary = async (req, res) => {
  try {
    await assertEmployeeAccess(req, req.params.employeeId);
    const summary = await attendanceService.getMonthlyAttendanceSummary({
      employeeId: req.params.employeeId,
      year: req.query.year,
      month: req.query.month,
    });

    return res.status(200).json({ success: true, data: summary });
  } catch (error) {
    return sendError(res, error);
  }
};
