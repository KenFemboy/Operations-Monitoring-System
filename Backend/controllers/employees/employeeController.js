import Employee from "../../models/Employee.js";
import Attendance from "../../models/Attendance.js";
import Branch from "../../models/Branch.js";

import Payroll from "../../models/Payroll.js";
import Leave from "../../models/Leave.js";
import Contribution from "../../models/Contribution.js";
import IncidentReport from "../../models/IncidentReport.js";
import NoticeToExplain from "../../models/NoticeToExplain.js";
import { isSuperAdmin } from "../../middleware/accessControl.js";
import { uploadToSupabase } from "../../utils/uploadToSupabase.js";
import { deleteFromSupabase } from "../../utils/deleteFromSupabase.js";

const getBranchName = (req) => {
  if (isSuperAdmin(req.user)) {
    return null;
  }

  const branchName = (req.user?.branch || "").trim();

  if (!branchName) {
    const error = new Error("Forbidden: no branch assigned");
    error.statusCode = 403;
    throw error;
  }

  return branchName;
};

const getRequestBranchId = (req) => {
  const branchId = req.user?.branchId;

  if (!branchId) {
    return null;
  }

  if (typeof branchId === "object" && branchId._id) {
    return branchId._id;
  }

  return branchId;
};

const findBranchByName = async (branchName) => {
  if (!branchName) {
    return null;
  }

  return Branch.findOne({ branchName }).select("_id branchName").lean();
};

const resolveBranchForEmployeeCreate = async (req) => {
  const branchName = getBranchName(req);
  const selectedBranchName = branchName || req.body.assignedBranch;
  const branchId = branchName
    ? getRequestBranchId(req)
    : req.body.branchId || req.body.branch;

  if (branchId) {
    const branch = await Branch.findById(branchId).select("_id branchName").lean();

    if (branch) {
      return {
        branchId: branch._id,
        branchName: branch.branchName,
      };
    }
  }

  const branch = await findBranchByName(selectedBranchName);

  if (!branch) {
    const error = new Error("Valid branch is required");
    error.statusCode = 400;
    throw error;
  }

  return {
    branchId: branch._id,
    branchName: branch.branchName,
  };
};

const getEmployeeBranchId = async (employeeId) => {
  const employee = await Employee.findById(employeeId)
    .select("branch assignedBranch")
    .lean();

  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  if (employee.branch) {
    return employee.branch;
  }

  const branch = await findBranchByName(employee.assignedBranch);

  if (!branch) {
    const error = new Error("Employee branch is missing or invalid");
    error.statusCode = 400;
    throw error;
  }

  return branch._id;
};

const assertEmployeeAccess = async (req, employeeId) => {
  const employee = await Employee.findOne({ _id: employeeId, isArchived: { $ne: true } })
    .select("employeeId assignedBranch branch photoPath")
    .lean();

  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  const branchName = getBranchName(req);

  if (branchName && employee.assignedBranch !== branchName) {
    const error = new Error("Forbidden: you can only access your assigned branch");
    error.statusCode = 403;
    throw error;
  }

  return employee;
};

const getBranchScopeFromRequest = async (req) => {
  if (isSuperAdmin(req.user)) {
    if (!req.query?.branchId) {
      return null;
    }

    const branch = await Branch.findById(req.query.branchId)
      .select("_id branchName")
      .lean();

    if (!branch) {
      const error = new Error("Valid branch is required");
      error.statusCode = 400;
      throw error;
    }

    return {
      branchId: branch._id,
      branchName: branch.branchName,
    };
  }

  return {
    branchId: getRequestBranchId(req),
    branchName: getBranchName(req),
  };
};

const getEmployeeIdsForBranchScope = async ({ branchId, branchName }) => {
  if (!branchId && !branchName) {
    return [];
  }

  const branchConditions = [];

  if (branchId) {
    branchConditions.push({ branch: branchId });
  }

  if (branchName) {
    branchConditions.push({ assignedBranch: branchName });
  }

  const employees = await Employee.find({ $or: branchConditions, isArchived: { $ne: true } })
    .select("_id")
    .lean();

  return employees.map((employee) => employee._id);
};

const buildEmployeeBranchFilter = (branchScope) => {
  if (!branchScope) {
    return {};
  }

  const branchConditions = [];

  if (branchScope.branchId) {
    branchConditions.push({ branch: branchScope.branchId });
  }

  if (branchScope.branchName) {
    branchConditions.push({ assignedBranch: branchScope.branchName });
  }

  return branchConditions.length ? { $or: branchConditions } : {};
};

const buildHrRecordBranchFilter = async (branchScope) => {
  if (!branchScope) {
    return {};
  }

  const employeeIds = await getEmployeeIdsForBranchScope(branchScope);
  const branchConditions = [];

  if (branchScope.branchId) {
    branchConditions.push({ branch: branchScope.branchId });
  }

  if (employeeIds.length) {
    branchConditions.push({ employee: { $in: employeeIds } });
  }

  return branchConditions.length ? { $or: branchConditions } : {};
};

const calculateAge = (birthdate) => {
  if (!birthdate) {
    return 0;
  }

  const date = new Date(birthdate);

  if (isNaN(date.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  return age > 0 ? age : 0;
};

const normalizeEmployeePayload = (body = {}) => {
  const payload = { ...body };

  ["dateHired", "birthdate"].forEach((field) => {
    if (payload[field] === "") {
      delete payload[field];
    }
  });

  if (payload.email === "") {
    delete payload.email;
  }

  if ("basicRate" in payload || "salaryRate" in payload) {
    const basicRate = payload.basicRate ?? payload.salaryRate ?? 0;
    payload.basicRate = Number(basicRate || 0);
    payload.salaryRate = Number(basicRate || 0);
  }

  if ("allowance" in payload) {
    payload.allowance = Number(payload.allowance || 0);
  }

  if ("phoneNumber" in payload || "phone" in payload) {
    const phoneNumber = payload.phoneNumber ?? payload.phone ?? "";
    payload.phoneNumber = phoneNumber;
    payload.phone = phoneNumber;
  }

  if ("sss" in payload || "sssId" in payload) {
    const sss = payload.sss ?? payload.sssId ?? "";
    payload.sss = sss;
    payload.sssId = sss;
  }

  if ("philhealth" in payload || "philhealthId" in payload) {
    const philhealth = payload.philhealth ?? payload.philhealthId ?? "";
    payload.philhealth = philhealth;
    payload.philhealthId = philhealth;
  }

  if ("pagibig" in payload || "pagibigId" in payload) {
    const pagibig = payload.pagibig ?? payload.pagibigId ?? "";
    payload.pagibig = pagibig;
    payload.pagibigId = pagibig;
  }

  if (payload.gender === "M") {
    payload.gender = "Male";
  }

  if (payload.gender === "F") {
    payload.gender = "Female";
  }

  if (payload.birthdate) {
    payload.age = calculateAge(payload.birthdate);
  }

  delete payload.gsisId;
  delete payload.photo;
  delete payload.photoUrl;
  delete payload.photoPath;

  return payload;
};

// ================= EMPLOYEE =================

export const createEmployee = async (req, res) => {
  let uploadedPhoto = null;

  try {
    const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });

    let newEmployeeId = "EMP-0001";

    if (lastEmployee && lastEmployee.employeeId) {
      const lastNumber = parseInt(lastEmployee.employeeId.split("-")[1]);
      const nextNumber = lastNumber + 1;
      newEmployeeId = `EMP-${String(nextNumber).padStart(4, "0")}`;
    }

    const branch = await resolveBranchForEmployeeCreate(req);
    uploadedPhoto = req.file ? await uploadToSupabase(req.file, "employees") : null;

    const employee = await Employee.create({
      ...normalizeEmployeePayload(req.body),
      assignedBranch: branch.branchName,
      branch: branch.branchId,
      employeeId: newEmployeeId,
      photo: uploadedPhoto?.url || "",
      photoUrl: uploadedPhoto?.url || "",
      photoPath: uploadedPhoto?.path || "",
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    if (uploadedPhoto?.path) {
      await deleteFromSupabase(uploadedPhoto.path).catch((deleteError) => {
        console.error("Failed to delete unassigned employee photo:", deleteError);
      });
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message === "Image upload failed"
          ? "Image upload failed"
          : "Failed to create employee",
      error: error.message,
    });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const branchScope = await getBranchScopeFromRequest(req);
    const filter = { ...buildEmployeeBranchFilter(branchScope), isArchived: { $ne: true } };
    const employees = await Employee.find(filter)
      .populate("branch", "branchName location address status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isArchived: { $ne: true },
    }).populate(
      "branch",
      "branchName location address status"
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const branchName = getBranchName(req);

    if (branchName && employee.assignedBranch !== branchName) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only access your assigned branch",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to fetch employee",
      error: error.message,
    });
  }
};

export const updateEmployee = async (req, res) => {
  let uploadedPhoto = null;

  try {
    const existingEmployee = await assertEmployeeAccess(req, req.params.id);
    const branchName = getBranchName(req);
    const hasBranchChange =
      req.body.branchId || req.body.branch || req.body.assignedBranch;
    const branch = branchName
      ? {
          branchName,
          branchId: getRequestBranchId(req) || existingEmployee.branch,
        }
      : hasBranchChange
        ? await resolveBranchForEmployeeCreate(req)
        : {
            branchName: existingEmployee.assignedBranch,
            branchId: existingEmployee.branch,
          };

    const updatePayload = {
      ...normalizeEmployeePayload(req.body),
      assignedBranch: branch.branchName || existingEmployee.assignedBranch,
      branch: branch.branchId || existingEmployee.branch,
    };

    uploadedPhoto = req.file ? await uploadToSupabase(req.file, "employees") : null;

    if (uploadedPhoto) {
      updatePayload.photo = uploadedPhoto.url;
      updatePayload.photoUrl = uploadedPhoto.url;
      updatePayload.photoPath = uploadedPhoto.path;
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    ).populate("branch", "branchName location address status");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    if (uploadedPhoto?.path) {
      await deleteFromSupabase(uploadedPhoto.path).catch((deleteError) => {
        console.error("Failed to delete unassigned employee photo:", deleteError);
      });
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message === "Image upload failed"
          ? "Image upload failed"
          : "Failed to update employee",
      error: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isArchived: { $ne: true },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (uploadedPhoto && existingEmployee.photoPath) {
      await deleteFromSupabase(existingEmployee.photoPath).catch((deleteError) => {
        console.error("Failed to delete replaced employee photo:", deleteError);
      });
    }

    await assertEmployeeAccess(req, req.params.id);

    employee.isArchived = true;
    employee.archivedAt = new Date();
    employee.archivedBy = req.user?._id || req.user?.id || null;
    employee.archiveReason = req.body?.reason || "No reason provided";
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee archived successfully",
      data: employee,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to archive employee",
      error: error.message,
    });
  }
};

// ================= ATTENDANCE =================

export const createAttendance = async (req, res) => {
  try {
    const {
      employee,
      date,
      timeIn,
      timeOut,
      status = "present",
      remarks,
    } = req.body;

    if (!employee || !date) {
      return res.status(400).json({
        success: false,
        message: "Employee and date are required",
      });
    }

    await assertEmployeeAccess(req, employee);
    const branch = await getEmployeeBranchId(employee);

    // Normalize date to start and end of selected day
    const selectedDate = new Date(date);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if employee already has attendance for that date
    const existingAttendance = await Attendance.findOne({
      employee,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already exists for this employee on this date",
      });
    }

    let totalHours = 0;

    if (timeIn && timeOut && status !== "absent") {
      const start = new Date(`${date}T${timeIn}:00`);
      const end = new Date(`${date}T${timeOut}:00`);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        totalHours = (end - start) / (1000 * 60 * 60);

        if (totalHours < 0) {
          totalHours = 0;
        }

        totalHours = Number(totalHours.toFixed(2));
      }
    }

    const attendance = await Attendance.create({
      employee,
      branch,
      date: selectedDate,
      timeIn,
      timeOut,
      status,
      remarks,
      totalHours,
    });

    res.status(201).json({
      success: true,
      message: "Attendance recorded successfully",
      data: attendance,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to record attendance",
      error: error.message,
    });
  }
};
export const getAttendance = async (req, res) => {
  try {
    const branchScope = await getBranchScopeFromRequest(req);
    const filter = await buildHrRecordBranchFilter(branchScope);

    const attendance = await Attendance.find(filter)
      .populate("employee")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};



// ================= PAYROLL =================

export const createPayroll = async (req, res) => {
  try {
    const {
      employee,
      payPeriodStart,
      payPeriodEnd,
      overtimePay = 0,
      deductions = 0,
    } = req.body;

    console.log("PAYROLL BODY:", req.body);

    if (!employee || !payPeriodStart || !payPeriodEnd) {
      return res.status(400).json({
        success: false,
        message: "Employee, start date, and end date are required",
      });
    }

    await assertEmployeeAccess(req, employee);

    const employeeData = await Employee.findById(employee);

    if (!employeeData) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const startDate = new Date(payPeriodStart);
    const endDate = new Date(payPeriodEnd);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid pay period date",
      });
    }

    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be earlier than start date",
      });
    }

    const existingPayroll = await Payroll.findOne({
      employee,
      payPeriodStart: { $gte: startDate, $lte: endDate },
      payPeriodEnd: { $gte: startDate, $lte: endDate },
    });

    if (existingPayroll) {
      return res.status(400).json({
        success: false,
        message: "Payroll already exists for this employee and pay period",
      });
    }

    const attendanceRecords = await Attendance.find({
      employee,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      status: {
        $in: ["present", "late", "half-day"],
      },
    });

    const totalHoursWorked = attendanceRecords.reduce((sum, record) => {
      return sum + Number(record.totalHours || 0);
    }, 0);

    const totalDaysWorked = attendanceRecords.reduce((sum, record) => {
      if (record.status === "half-day") {
        return sum + 0.5;
      }

      return sum + 1;
    }, 0);

    const dailyRate = Number(employeeData.basicRate ?? employeeData.salaryRate ?? 0);
    const basicPay = dailyRate * totalDaysWorked;
    const finalOvertime = Number(overtimePay || 0);
    const finalDeductions = Number(deductions || 0);
    const netPay = basicPay + finalOvertime - finalDeductions;

    const payroll = await Payroll.create({
      employee,
      branch: employeeData.branch || (await getEmployeeBranchId(employee)),
      payPeriodStart: startDate,
      payPeriodEnd: endDate,
      hourlyRate: dailyRate,
      dailyRate,
      totalHoursWorked: Number(totalHoursWorked.toFixed(2)),
      totalDaysWorked: Number(totalDaysWorked.toFixed(2)),
      basicPay: Number(basicPay.toFixed(2)),
      overtimePay: finalOvertime,
      deductions: finalDeductions,
      netPay: Number(netPay.toFixed(2)),
      status: "pending",
    });

    const populatedPayroll = await Payroll.findById(payroll._id).populate(
      "employee",
      "employeeId firstName lastName salaryRate basicRate"
    );

    res.status(201).json({
      success: true,
      message: "Payroll created successfully",
      data: populatedPayroll,
    });
  } catch (error) {
    console.error("CREATE PAYROLL ERROR:", error);

    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to create payroll",
      error: error.message,
    });
  }
};

export const getPayrolls = async (req, res) => {
  try {
    const branchScope = await getBranchScopeFromRequest(req);
    const filter = await buildHrRecordBranchFilter(branchScope);

    const payrolls = await Payroll.find(filter)
      .populate("employee", "employeeId firstName lastName salaryRate basicRate")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payrolls,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to fetch payrolls",
      error: error.message,
    });
  }
};
export const updatePayrollStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "done"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payroll status",
      });
    }

    const existingPayroll = await Payroll.findById(req.params.id).populate(
      "employee",
      "assignedBranch"
    );

    if (!existingPayroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    const branchName = getBranchName(req);

    if (branchName && existingPayroll.employee?.assignedBranch !== branchName) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only access your assigned branch",
      });
    }

    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("employee");

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payroll status updated",
      data: payroll,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to update payroll status",
      error: error.message,
    });
  }
};
// ================= LEAVE =================

export const createLeave = async (req, res) => {
  try {
    if (!req.body.employee) {
      return res.status(400).json({
        success: false,
        message: "Employee is required",
      });
    }

    await assertEmployeeAccess(req, req.body.employee);
    const leave = await Leave.create({
      ...req.body,
      branch: await getEmployeeBranchId(req.body.employee),
    });

    res.status(201).json({
      success: true,
      message: "Leave filed successfully",
      data: leave,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to file leave",
      error: error.message,
    });
  }
};

export const getLeaves = async (req, res) => {
  try {
    const branchScope = await getBranchScopeFromRequest(req);
    const filter = await buildHrRecordBranchFilter(branchScope);

    const leaves = await Leave.find(filter)
      .populate("employee", "employeeId firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to fetch leaves",
      error: error.message,
    });
  }
};
export const updateLeave = async (req, res) => {
  try {
    const existingLeave = await Leave.findById(req.params.id).populate(
      "employee",
      "assignedBranch"
    );

    if (!existingLeave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    const branchName = getBranchName(req);

    if (branchName && existingLeave.employee?.assignedBranch !== branchName) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only access your assigned branch",
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("employee", "employeeId firstName lastName");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Leave updated successfully",
      data: leave,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to update leave",
      error: error.message,
    });
  }
};
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "denied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave status",
      });
    }

    const existingLeave = await Leave.findById(req.params.id).populate(
      "employee",
      "assignedBranch"
    );

    if (!existingLeave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    const branchName = getBranchName(req);

    if (branchName && existingLeave.employee?.assignedBranch !== branchName) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only access your assigned branch",
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("employee", "employeeId firstName lastName");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Leave status updated",
      data: leave,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to update leave status",
      error: error.message,
    });
  }
};

// ================= CONTRIBUTIONS =================

export const createContribution = async (req, res) => {
  try {
    const { month, sss = 0, pagibig = 0, philhealth = 0 } = req.body;

    if (!req.body.employee) {
      return res.status(400).json({
        success: false,
        message: "Employee is required",
      });
    }

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: "Contribution month must include month and year",
      });
    }

    await assertEmployeeAccess(req, req.body.employee);

    const contribution = await Contribution.create({
      ...req.body,
      branch: await getEmployeeBranchId(req.body.employee),
      totalContribution: sss + pagibig + philhealth,
    });

    res.status(201).json({
      success: true,
      message: "Contribution recorded successfully",
      data: contribution,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to record contribution",
      error: error.message,
    });
  }
};

export const getContributions = async (req, res) => {
  try {
    const branchScope = await getBranchScopeFromRequest(req);
    const filter = await buildHrRecordBranchFilter(branchScope);

    const contributions = await Contribution.find(filter)
      .populate(
        "employee",
        "employeeId firstName lastName sss sssId pagibig pagibigId philhealth philhealthId tin assignedBranch"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contributions,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to fetch contributions",
      error: error.message,
    });
  }
};

// ================= INCIDENT REPORT =================

export const createIncidentReport = async (req, res) => {
  try {
    if (!req.body.employee) {
      return res.status(400).json({
        success: false,
        message: "Employee is required",
      });
    }

    await assertEmployeeAccess(req, req.body.employee);
    const report = await IncidentReport.create({
      ...req.body,
      branch: await getEmployeeBranchId(req.body.employee),
      status: "open",
    });

    res.status(201).json({
      success: true,
      message: "Incident report created successfully",
      data: report,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to create incident report",
      error: error.message,
    });
  }
};

export const getIncidentReports = async (req, res) => {
  try {
    const branchScope = await getBranchScopeFromRequest(req);
    const filter = await buildHrRecordBranchFilter(branchScope);

    const reports = await IncidentReport.find(filter)
      .populate("employee", "employeeId firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to fetch incident reports",
      error: error.message,
    });
  }
};

export const updateIncidentReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["open", "under-review", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident report status",
      });
    }

    const existingReport = await IncidentReport.findById(req.params.id).populate(
      "employee",
      "assignedBranch"
    );

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: "Incident report not found",
      });
    }

    const branchName = getBranchName(req);

    if (branchName && existingReport.employee?.assignedBranch !== branchName) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only access your assigned branch",
      });
    }

    const report = await IncidentReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("employee", "employeeId firstName lastName");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Incident report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Incident report status updated",
      data: report,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to update incident report status",
      error: error.message,
    });
  }
};
// ================= NTE =================

export const createNTE = async (req, res) => {
  try {
    if (!isSuperAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: only Super Admin can create NTE records",
      });
    }

    if (!req.body.employee) {
      return res.status(400).json({
        success: false,
        message: "Employee is required",
      });
    }

    await assertEmployeeAccess(req, req.body.employee);
    const {
      branch: _branch,
      branchId: _branchId,
      assignedBranch: _assignedBranch,
      status: _status,
      ...safeBody
    } = req.body;
    const nte = await NoticeToExplain.create({
      ...safeBody,
      branch: await getEmployeeBranchId(req.body.employee),
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Notice to Explain created successfully",
      data: nte,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to create NTE",
      error: error.message,
    });
  }
};

export const getNTEs = async (req, res) => {
  try {
    const branchScope = await getBranchScopeFromRequest(req);
    const filter = await buildHrRecordBranchFilter(branchScope);

    const ntes = await NoticeToExplain.find(filter)
      .populate({
        path: "employee",
        select: "employeeId firstName lastName assignedBranch branch",
        populate: { path: "branch", select: "branchName" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ntes,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to fetch NTE records",
      error: error.message,
    });
  }
};

export const updateNTEStatus = async (req, res) => {
  try {
    if (!isSuperAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: only Super Admin can update NTE records",
      });
    }

    const { status } = req.body;

    if (!["pending", "submitted", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid NTE status",
      });
    }

    const existingNte = await NoticeToExplain.findById(req.params.id).populate(
      "employee",
      "assignedBranch"
    );

    if (!existingNte) {
      return res.status(404).json({
        success: false,
        message: "NTE record not found",
      });
    }

    const branchName = getBranchName(req);

    if (branchName && existingNte.employee?.assignedBranch !== branchName) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only access your assigned branch",
      });
    }

    const nte = await NoticeToExplain.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate({
      path: "employee",
      select: "employeeId firstName lastName assignedBranch branch",
      populate: { path: "branch", select: "branchName" },
    });

    if (!nte) {
      return res.status(404).json({
        success: false,
        message: "NTE record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "NTE status updated",
      data: nte,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to update NTE status",
      error: error.message,
    });
  }
};

export const getEmployeeFullDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({ _id: id, isArchived: { $ne: true } }).populate(
      "branch",
      "branchName location address status"
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const branchName = getBranchName(req);

    if (branchName && employee.assignedBranch !== branchName) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only access your assigned branch",
      });
    }

    const attendance = await Attendance.find({ employee: id }).sort({ date: -1 });
    const payrolls = await Payroll.find({ employee: id }).sort({ createdAt: -1 });
    const leaves = await Leave.find({ employee: id }).sort({ createdAt: -1 });
    const contributions = await Contribution.find({ employee: id }).sort({ createdAt: -1 });
    const incidentReports = await IncidentReport.find({ employee: id }).sort({ createdAt: -1 });
    const ntes = await NoticeToExplain.find({ employee: id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        employee,
        attendance,
        payrolls,
        leaves,
        contributions,
        incidentReports,
        ntes,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to fetch employee details",
      error: error.message,
    });
  }
};
