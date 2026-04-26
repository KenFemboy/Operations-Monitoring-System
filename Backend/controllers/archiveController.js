import ArchiveEntry from "../models/ArchiveEntry.js";
import User from "../models/User.js";
import Branch from "../models/Branch.js";
import bcrypt from "bcryptjs";

export const getArchiveEntries = async (_req, res) => {
  try {
    const archiveEntries = await ArchiveEntry.find()
      .populate("deletedBy", "name email")
      .sort({ deletedAt: -1 });

    return res.status(200).json({
      success: true,
      count: archiveEntries.length,
      data: archiveEntries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const restoreArchiveEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const authorizationPassword = req.body.authorizationPassword || req.body.superadminPassword;

    if (!authorizationPassword) {
      return res.status(400).json({
        success: false,
        message: "Authorization password is required.",
      });
    }

    const currentUser = await User.findById(req.user?.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Current user not found.",
      });
    }

    if (currentUser.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only super admins can restore archive entries.",
      });
    }

    const isAuthorizationPasswordValid = await bcrypt.compare(
      authorizationPassword,
      currentUser.password,
    );

    if (!isAuthorizationPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization password.",
      });
    }

    const archiveEntry = await ArchiveEntry.findById(entryId);

    if (!archiveEntry) {
      return res.status(404).json({
        success: false,
        message: "Archive entry not found.",
      });
    }

    const { entityType, snapshot } = archiveEntry;

    if (entityType === "branch") {
      const existingBranch = await Branch.findOne({ branchName: snapshot.branchName });

      if (existingBranch) {
        return res.status(409).json({
          success: false,
          message: "A branch with this name already exists.",
        });
      }

      const { _id, createdAt, updatedAt, detachedUsersCount, ...branchData } = snapshot;
      const restoredBranch = await Branch.create(branchData);

      await ArchiveEntry.deleteOne({ _id: entryId });

      return res.status(200).json({
        success: true,
        message: "Branch restored successfully.",
        data: restoredBranch,
      });
    } else if (entityType === "user") {
      const existingUser = await User.findOne({ email: snapshot.email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "A user with this email already exists.",
        });
      }

      const { _id, createdAt, updatedAt, ...userData } = snapshot;
      const restoredUser = await User.create(userData);

      await ArchiveEntry.deleteOne({ _id: entryId });

      return res.status(200).json({
        success: true,
        message: "User restored successfully.",
        data: restoredUser,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid entity type.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearArchive = async (req, res) => {
  try {
    const authorizationPassword = req.body.authorizationPassword || req.body.superadminPassword;

    if (!authorizationPassword) {
      return res.status(400).json({
        success: false,
        message: "Authorization password is required.",
      });
    }

    const currentUser = await User.findById(req.user?.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Current user not found.",
      });
    }

    if (currentUser.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only super admins can clear archive.",
      });
    }

    const isAuthorizationPasswordValid = await bcrypt.compare(
      authorizationPassword,
      currentUser.password,
    );

    if (!isAuthorizationPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization password.",
      });
    }

    await ArchiveEntry.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "Archive cleared successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};