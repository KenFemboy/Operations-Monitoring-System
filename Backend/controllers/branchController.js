import Branch from "../models/Branch.js";
import User from "../models/User.js";

export const createBranch = async (req, res) => {
  try {
    const { branchName, location, address, dedicatedAdmin } = req.body;

    const branch = await Branch.create({
      branchName,
      location,
      address,
      dedicatedAdmin: dedicatedAdmin || null,
    });

    if (dedicatedAdmin) {
      await User.findByIdAndUpdate(dedicatedAdmin, {
        branch: branch.branchName,
        branchId: branch._id,
        role: "console_user",
      });
    }

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create branch",
      error: error.message,
    });
  }
};

export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find()
      .populate("dedicatedAdmin", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch branches",
      error: error.message,
    });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchName, location, address, dedicatedAdmin, status } = req.body;

    const branch = await Branch.findByIdAndUpdate(
      id,
      {
        branchName,
        location,
        address,
        dedicatedAdmin: dedicatedAdmin || null,
        status,
      },
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    if (dedicatedAdmin) {
      await User.findByIdAndUpdate(dedicatedAdmin, {
        branch: branch.branchName,
        branchId: branch._id,
        role: "console_user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update branch",
      error: error.message,
    });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const branch = await Branch.findByIdAndDelete(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    await User.updateMany(
      { branch: id },
      {
        $set: {
          branch: null,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete branch",
      error: error.message,
    });
  }
};
