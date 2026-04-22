import * as employeeService from "../modules/employee/employee.service.js";

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

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getEmployees = async (_req, res) => {
  try {
    const employees = await employeeService.getEmployees();

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