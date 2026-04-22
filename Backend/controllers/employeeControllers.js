import Employee from "../models/Employee.js";

const EMPLOYEE_ID_PREFIX = "EMP";

const generateEmployeeId = async () => {
  const totalEmployees = await Employee.countDocuments();
  let sequence = totalEmployees + 1;

  while (true) {
    const employeeId = `${EMPLOYEE_ID_PREFIX}-${String(sequence).padStart(5, "0")}`;
    const existingEmployee = await Employee.findOne({ employeeId }).select("_id");

    if (!existingEmployee) {
      return employeeId;
    }

    sequence += 1;
  }
};

export const createEmployee = async (req, res) => {
  try {
    let employee;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const employeeId = await generateEmployeeId();
      const payload = { ...req.body, employeeId };

      try {
        employee = await Employee.create(payload);
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