import * as employeeService from "../modules/employee/employee.service.js";
import mongoose from "mongoose";
import { canAccessBranch } from "../middleware/accessControl.js";

export const createEmployee = async (req, res) => {
  try {
    let employee;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const employeeId = await employeeService.generateEmployeeId();
      const payload = { ...req.body, employeeId };

      try {
        employee = await employeeService.createEmployee(payload);
        break;
      } catch (err) {
        if (err.code !== 11000 || !err.keyPattern?.employeeId || attempt === 4) {
          throw err;
        }
      }
    }

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getEmployees = async (_req, res) => {
  try {
    const employees = _req.branchScope?.branchId
      ? await employeeService.getEmployeesByBranchId(_req.branchScope.branchId)
      : await employeeService.getEmployees();

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getEmployeesByBranchId = async (req, res) => {
  try {
    const { branchId } = req.params;

    if (!canAccessBranch(req.user, branchId)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only access your assigned branch",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(branchId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid branchId",
      });
    }

    const employees = await employeeService.getEmployeesByBranchId(branchId);

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.updateEmployee(id, req.body);

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
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deactivateEmployee = async (req, res) => {
  try {
    const employee = await employeeService.deactivateEmployee(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};
