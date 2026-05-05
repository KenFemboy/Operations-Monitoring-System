import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import Branch from "../models/Branch.js";

import Payroll from "../models/Payroll.js";
import Leave from "../models/Leave.js";
import Contribution from "../models/Contribution.js";
import IncidentReport from "../models/IncidentReport.js";
import NoticeToExplain from "../models/NoticeToExplain.js";
import { isSuperAdmin } from "../middleware/accessControl.js";

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
  const employee = await Employee.findById(employeeId)
    .select("assignedBranch branch")
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

const getEmployeeIdsForBranch = async (branchName) => {
  const employees = await Employee.find({ assignedBranch: branchName })
    .select("_id")
    .lean();
  return employees.map((employee) => employee._id);
};

// ================= EMPLOYEE =================

export const createEmployee = async (req, res) => {
  try {
    const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });

    let newEmployeeId = "EMP-0001";

    if (lastEmployee && lastEmployee.employeeId) {
      const lastNumber = parseInt(lastEmployee.employeeId.split("-")[1]);
      const nextNumber = lastNumber + 1;
      newEmployeeId = `EMP-${String(nextNumber).padStart(4, "0")}`;
    }

    const branch = await resolveBranchForEmployeeCreate(req);

    const employee = await Employee.create({
      ...req.body,
      assignedBranch: branch.branchName,
      branch: branch.branchId,
      employeeId: newEmployeeId,
      employmentStatus: "active",
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to create employee",
      error: error.message,
    });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const branchName = getBranchName(req);
    const filter = branchName ? { assignedBranch: branchName } : {};
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
    const employee = await Employee.findById(req.params.id).populate(
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
      ...req.body,
      assignedBranch: branch.branchName || existingEmployee.assignedBranch,
      branch: branch.branchId || existingEmployee.branch,
    };

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true }
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
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    await assertEmployeeAccess(req, req.params.id);
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to delete employee",
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
    const branchName = getBranchName(req);
    let filter = {};

    if (branchName) {
      const employeeIds = await getEmployeeIdsForBranch(branchName);
      filter = { employee: { $in: employeeIds } };
    }

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

    const hourlyRate = Number(employeeData.salaryRate || 0);
    const basicPay = hourlyRate * totalHoursWorked;
    const finalOvertime = Number(overtimePay || 0);
    const finalDeductions = Number(deductions || 0);
    const netPay = basicPay + finalOvertime - finalDeductions;

    const payroll = await Payroll.create({
      employee,
      branch: employeeData.branch || (await getEmployeeBranchId(employee)),
      payPeriodStart: startDate,
      payPeriodEnd: endDate,
      hourlyRate,
      totalHoursWorked: Number(totalHoursWorked.toFixed(2)),
      basicPay: Number(basicPay.toFixed(2)),
      overtimePay: finalOvertime,
      deductions: finalDeductions,
      netPay: Number(netPay.toFixed(2)),
      status: "pending",
    });

    const populatedPayroll = await Payroll.findById(payroll._id).populate(
      "employee",
      "employeeId firstName lastName salaryRate"
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
    const branchName = getBranchName(req);
    let filter = {};

    if (branchName) {
      const employeeIds = await getEmployeeIdsForBranch(branchName);
      filter = { employee: { $in: employeeIds } };
    }

    const payrolls = await Payroll.find(filter)
      .populate("employee", "employeeId firstName lastName salaryRate")
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
    const branchName = getBranchName(req);
    let filter = {};

    if (branchName) {
      const employeeIds = await getEmployeeIdsForBranch(branchName);
      filter = { employee: { $in: employeeIds } };
    }

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
    const { sss = 0, pagibig = 0, philhealth = 0 } = req.body;

    if (!req.body.employee) {
      return res.status(400).json({
        success: false,
        message: "Employee is required",
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
    const branchName = getBranchName(req);
    let filter = {};

    if (branchName) {
      const employeeIds = await getEmployeeIdsForBranch(branchName);
      filter = { employee: { $in: employeeIds } };
    }

    const contributions = await Contribution.find(filter)
      .populate(
        "employee",
        "employeeId firstName lastName sssId gsisId pagibigId philhealthId assignedBranch"
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
    const branchName = getBranchName(req);
    let filter = {};

    if (branchName) {
      const employeeIds = await getEmployeeIdsForBranch(branchName);
      filter = { employee: { $in: employeeIds } };
    }

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
    if (!req.body.employee) {
      return res.status(400).json({
        success: false,
        message: "Employee is required",
      });
    }

    await assertEmployeeAccess(req, req.body.employee);
    const nte = await NoticeToExplain.create({
      ...req.body,
      branch: await getEmployeeBranchId(req.body.employee),
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
    const branchName = getBranchName(req);
    let filter = {};

    if (branchName) {
      const employeeIds = await getEmployeeIdsForBranch(branchName);
      filter = { employee: { $in: employeeIds } };
    }

    const ntes = await NoticeToExplain.find(filter)
      .populate("employee", "employeeId firstName lastName")
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
    ).populate("employee", "employeeId firstName lastName");

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

    const employee = await Employee.findById(id).populate(
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
