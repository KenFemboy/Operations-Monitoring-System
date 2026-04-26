import Branch from '../models/Branch.js';
import User from '../models/User.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const resolveAdminBranch = async (userId) => {
  const user = await User.findById(userId).populate('branchId');

  if (!user) {
    return { user: null, branch: null };
  }

  if (user.branchId?._id) {
    return { user, branch: user.branchId };
  }

  if (user.branch) {
    const normalizedBranchName = user.branch.trim();
    const branchNamePattern = new RegExp(
      `^${escapeRegex(normalizedBranchName).replace(/['’]/g, "['’]")}$`,
      'i',
    );

    const branch = await Branch.findOne({ branchName: branchNamePattern });

    if (branch) {
      user.branchId = branch._id;
      user.branch = branch.branchName;
      await user.save();
    }

    return { user, branch };
  }

  return { user, branch: null };
};

// Create a new branch
export const createBranch = async (req, res) => {
  try {
    const { branchName, location, description, address } = req.body;

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
      address: address?.trim(),
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

export const getBranchesByLocation = async (req, res) => {
  try {
    const branches = await Branch.find({ location: req.params.location });

    if (!branches.length) {
      return res.status(404).json({
        success: false,
        message: "No branches found in this location.",
      });
    }

    res.status(200).json({
        success: true,
        count: branches.length,
        data: branches,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid branch ID.",
      });
    }

    res.status(500).json({
        success: false,
        message: err.message,
    });
  }
};

export const getMyBranch = async (req, res) => {
  try {
    const { user, branch } = await resolveAdminBranch(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'No branch assigned to this admin account.',
      });
    }

    return res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateMyBranch = async (req, res) => {
  try {
    const { user, branch } = await resolveAdminBranch(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'No branch assigned to this admin account.',
      });
    }

    const { branchName, location, address, description } = req.body;
    const trimmedBranchName = typeof branchName === 'string' ? branchName.trim() : '';

    if (!trimmedBranchName) {
      return res.status(400).json({
        success: false,
        message: 'Branch name is required.',
      });
    }

    const hasNameChanged = trimmedBranchName !== branch.branchName;

    if (hasNameChanged) {
      const duplicateBranch = await Branch.findOne({ branchName: trimmedBranchName });

      if (duplicateBranch && String(duplicateBranch._id) !== String(branch._id)) {
        return res.status(409).json({
          success: false,
          message: 'Branch name already exists.',
        });
      }
    }

    branch.branchName = trimmedBranchName;
    branch.location = typeof location === 'string' ? location.trim() : '';
    branch.address = typeof address === 'string' ? address.trim() : '';
    branch.description = typeof description === 'string' ? description.trim() : '';

    const updatedBranch = await branch.save();

    // Keep the admin account synchronized with branch assignment fields.
    user.branchId = updatedBranch._id;
    user.branch = updatedBranch.branchName;
    await user.save();

    return res.status(200).json({
      success: true,
      data: updatedBranch,
      message: 'Branch updated successfully.',
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};






