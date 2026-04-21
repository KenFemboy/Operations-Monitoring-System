import Employee from "../models/Employee.js";

export const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, role, assignedBranch, status } = req.body;

    const employee = await Employee.create({
      firstName,
      lastName,
      role,
      assignedBranch,
      status,
    });

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

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getEmployees = async (_req, res) => {
  try {
    const employees = await Employee.find({}).sort({ createdAt: -1 });

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