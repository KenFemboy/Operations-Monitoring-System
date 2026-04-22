import mongoose from "mongoose";
import Department from "../models/Department.js";
import Position from "../models/Position.js";

export const createPosition = async (req, res) => {
  try {
    const { name, departmentId, baseSalary, dailyRate, level, status } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Position name is required.",
      });
    }

    if (!departmentId || !mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({
        success: false,
        message: "A valid departmentId is required.",
      });
    }

    const departmentExists = await Department.exists({ _id: departmentId });
    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    const position = await Position.create({
      name: name.trim(),
      departmentId,
      baseSalary,
      dailyRate,
      level,
      status,
    });

    const populatedPosition = await Position.findById(position._id).populate(
      "departmentId",
      "name code status"
    );

    res.status(201).json({
      success: true,
      data: populatedPosition,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Position already exists for this department.",
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

export const getPositions = async (req, res) => {
  try {
    const { departmentId, status } = req.query;
    const filters = {};

    if (departmentId) {
      if (!mongoose.Types.ObjectId.isValid(departmentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid departmentId filter.",
        });
      }
      filters.departmentId = departmentId;
    }

    if (status) {
      filters.status = status;
    }

    const positions = await Position.find(filters)
      .populate("departmentId", "name branch location status")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: positions.length,
      data: positions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
