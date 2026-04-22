import Department from "../models/Department.js";

export const createDepartment = async (req, res) => {
  try {
    const { name, code, description, status } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name is required.",
      });
    }

    const department = await Department.create({
      name: name.trim(),
      code: code?.trim(),
      description: description?.trim(),
      status,
    });

    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(409).json({
        success: false,
        message: `${duplicateField} already exists.`,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDepartments = async (_req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
