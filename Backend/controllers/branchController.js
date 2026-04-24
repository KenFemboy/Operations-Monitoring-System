import Branch from '../models/Branch.js';

// Create a new branch
export const createBranch = async (req, res) => {
  try {
    const { branchName, location, description } = req.body;

    if (!branchName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Branch name is required.",
      });
    }
    const branch = await Branch.create({
      branchName: branchName.trim(),
      location: location?.trim(),
      description: description?.trim(),
    });

    res.status(201).json({
        success: true,
        data: branch,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Branch name already exists.",
      });
    }

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

// Get all branches
export const getBranches = async (_req, res) => {
  try {
    const branches = await Branch.find().sort({ branchName: 1 });

    res.status(200).json({
        success: true,
        count: branches.length,
        data: branches,
    });
  } catch (err) {
    res.status(500).json({
        success: false,
        message: err.message,
    }); 
    }
};