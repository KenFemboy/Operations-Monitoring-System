import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

import Payroll from "../models/Payroll.js";
import Leave from "../models/Leave.js";
import Contribution from "../models/Contribution.js";
import IncidentReport from "../models/IncidentReport.js";
import NoticeToExplain from "../models/NoticeToExplain.js";

// ================= EMPLOYEE =================

export const createEmployee = async (req, res) => {
  try {
    // Get latest employee based on employeeId
    const lastEmployee = await Employee.findOne()
      .sort({ createdAt: -1 });

    let newEmployeeId = "EMP-0001";

    if (lastEmployee && lastEmployee.employeeId) {
      // Extract number from last ID
      const lastNumber = parseInt(lastEmployee.employeeId.split("-")[1]);

      const nextNumber = lastNumber + 1;

      // Pad with leading zeros
      newEmployeeId = `EMP-${String(nextNumber).padStart(4, "0")}`;
    }

    const employee = await Employee.create({
      ...req.body,
      employeeId: newEmployeeId,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create employee",
      error: error.message,
    });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee",
      error: error.message,
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

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
    res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
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
    res.status(500).json({
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
    res.status(500).json({
      success: false,
      message: "Failed to record attendance",
      error: error.message,
    });
  }
};
export const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("employee")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(500).json({
      success: false,
      message: "Failed to create payroll",
      error: error.message,
    });
  }
};

export const getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employee", "employeeId firstName lastName salaryRate")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payrolls,
    });
  } catch (error) {
    res.status(500).json({
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
    res.status(500).json({
      success: false,
      message: "Failed to update payroll status",
      error: error.message,
    });
  }
};
// ================= LEAVE =================

export const createLeave = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);

    res.status(201).json({
      success: true,
      message: "Leave filed successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to file leave",
      error: error.message,
    });
  }
};

export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "employeeId firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaves",
      error: error.message,
    });
  }
};
export const updateLeave = async (req, res) => {
  try {
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
    res.status(500).json({
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
    res.status(500).json({
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

    const contribution = await Contribution.create({
      ...req.body,
      totalContribution: sss + pagibig + philhealth,
    });

    res.status(201).json({
      success: true,
      message: "Contribution recorded successfully",
      data: contribution,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to record contribution",
      error: error.message,
    });
  }
};

export const getContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find()
      .populate("employee", "employeeId firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contributions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contributions",
      error: error.message,
    });
  }
};

// ================= INCIDENT REPORT =================

export const createIncidentReport = async (req, res) => {
  try {
    const report = await IncidentReport.create(req.body);

    res.status(201).json({
      success: true,
      message: "Incident report created successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create incident report",
      error: error.message,
    });
  }
};

export const getIncidentReports = async (req, res) => {
  try {
    const reports = await IncidentReport.find()
      .populate("employee", "employeeId firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch incident reports",
      error: error.message,
    });
  }
};

// ================= NTE =================

export const createNTE = async (req, res) => {
  try {
    const nte = await NoticeToExplain.create(req.body);

    res.status(201).json({
      success: true,
      message: "Notice to Explain created successfully",
      data: nte,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create NTE",
      error: error.message,
    });
  }
};

export const getNTEs = async (req, res) => {
  try {
    const ntes = await NoticeToExplain.find()
      .populate("employee", "employeeId firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ntes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch NTE records",
      error: error.message,
    });
  }
};

export const getEmployeeFullDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
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
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee details",
      error: error.message,
    });
  }
};