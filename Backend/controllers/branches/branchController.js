import Branch from "../../models/Branch.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import { getUserBranchId, isSuperAdmin } from "../../middleware/accessControl.js";

export const createBranch = async (req, res) => {
  try {
    const { branchName, location, address } = req.body;
    const authorizationPassword =
      req.body.authorizationPassword || req.body.superadminPassword;

    if (!authorizationPassword) {
      return res.status(400).json({
        success: false,
        message: "Superadmin password is required",
      });
    }

    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Current user not found",
      });
    }

    const isAuthorizationPasswordValid = await bcrypt.compare(
      authorizationPassword,
      currentUser.password
    );

    if (!isAuthorizationPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid superadmin password",
      });
    }

    const branch = await Branch.create({
      branchName,
      location,
      address,
    });

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
    const filter = {};

    if (!isSuperAdmin(req.user)) {
      const branchId = getUserBranchId(req.user);

      if (!branchId) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: no branch assigned",
        });
      }

      filter._id = branchId;
    }

    const branches = await Branch.find(filter).sort({ createdAt: -1 });

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
    const { branchName, location, address, status } = req.body;

    const branch = await Branch.findByIdAndUpdate(
      id,
      {
        branchName,
        location,
        address,
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
