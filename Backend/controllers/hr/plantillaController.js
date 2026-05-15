import Plantilla from "../../models/Plantilla.js";
import Branch from "../../models/Branch.js";
import { isSuperAdmin, getUserBranchId } from "../../middleware/accessControl.js";
import { getBranchFilter } from "../../utils/branchFilter.js";
import { assertCanAccessBranch } from "../../utils/branchAccess.js";

const getPlantillaStatus = (requiredCount, currentCount) => {
  const required = Number(requiredCount || 0);
  const current = Number(currentCount || 0);

  if (current === 0) return "open";
  if (current < required) return "understaffed";
  if (current === required) return "filled";
  if (current > required) return "overstaffed";

  return "open";
};

const resolveBranch = async ({ branch, branchId, branchName }) => {
  const selectedBranch = branchId || branch;
  let resolvedBranch = null;

  if (selectedBranch) {
    resolvedBranch = await Branch.findById(selectedBranch).catch(() => null);
  }

  if (!resolvedBranch) {
    const selectedBranchName = branchName || branch;

    if (selectedBranchName) {
      resolvedBranch = await Branch.findOne({ branchName: selectedBranchName });
    }
  }

  if (!resolvedBranch) {
    const error = new Error("Valid branch is required");
    error.statusCode = 400;
    throw error;
  }

  return resolvedBranch;
};

export const createPlantilla = async (req, res) => {
  try {
    const { position, branch, branchId, branchName, requiredCount, currentCount } = req.body;
    let resolvedBranch = null;

    if (isSuperAdmin(req.user)) {
      resolvedBranch = await resolveBranch({ branch, branchId, branchName });
    } else {
      const userBranchId = getUserBranchId(req.user);
      if (!userBranchId) throw new Error("User has no branch assigned");
      resolvedBranch = await Branch.findById(userBranchId);
      if (!resolvedBranch) throw new Error("Valid branch is required");
    }

    const plantilla = await Plantilla.create({
      position,
      branch: resolvedBranch._id,
      requiredCount: Number(requiredCount || 0),
      currentCount: Number(currentCount || 0),
      status: getPlantillaStatus(requiredCount, currentCount),
    });

    res.status(201).json({
      success: true,
      message: "Plantilla created successfully",
      data: plantilla,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create plantilla",
      error: error.message,
    });
  }
};

export const getPlantillas = async (req, res) => {
  try {
    const filter = { ...getBranchFilter(req), isArchived: { $ne: true } };
    const plantillas = await Plantilla.find(filter)
      .populate("branch", "branchName location address status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: plantillas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch plantillas",
      error: error.message,
    });
  }
};

export const getPlantillaById = async (req, res) => {
  try {
    const plantilla = await Plantilla.findOne({
      _id: req.params.id,
      isArchived: { $ne: true },
    }).populate("branch", "branchName location address status");

    if (!plantilla) {
      return res.status(404).json({
        success: false,
        message: "Plantilla not found",
      });
    }

    assertCanAccessBranch(req, plantilla.branch);

    res.status(200).json({
      success: true,
      data: plantilla,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch plantilla",
      error: error.message,
    });
  }
};

export const updatePlantilla = async (req, res) => {
  try {
    const { position, branch, branchId, branchName, requiredCount, currentCount } = req.body;
    const existingPlantilla = await Plantilla.findOne({
      _id: req.params.id,
      isArchived: { $ne: true },
    });

    if (!existingPlantilla) {
      return res.status(404).json({
        success: false,
        message: "Plantilla not found",
      });
    }

    assertCanAccessBranch(req, existingPlantilla.branch);

    const resolvedBranch = isSuperAdmin(req.user)
      ? await resolveBranch({
          branch: branch || existingPlantilla.branch,
          branchId,
          branchName,
        })
      : await Branch.findById(getUserBranchId(req.user));

    const plantilla = await Plantilla.findByIdAndUpdate(
      req.params.id,
      {
        position,
        branch: resolvedBranch._id,
        requiredCount: Number(requiredCount || 0),
        currentCount: Number(currentCount || 0),
        status: getPlantillaStatus(requiredCount, currentCount),
      },
      { new: true, runValidators: true }
    ).populate("branch", "branchName location address status");

    if (!plantilla) {
      return res.status(404).json({
        success: false,
        message: "Plantilla not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plantilla updated successfully",
      data: plantilla,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update plantilla",
      error: error.message,
    });
  }
};
export const deletePlantilla = async (req, res) => {
  try {
    const plantilla = await Plantilla.findOne({
      _id: req.params.id,
      isArchived: { $ne: true },
    });

    if (!plantilla) {
      return res.status(404).json({
        success: false,
        message: "Plantilla not found",
      });
    }

    assertCanAccessBranch(req, plantilla.branch);

    plantilla.isArchived = true;
    plantilla.archivedAt = new Date();
    plantilla.archivedBy = req.user?._id || req.user?.id || null;
    plantilla.archiveReason = req.body?.reason || "No reason provided";
    await plantilla.save();

    res.status(200).json({
      success: true,
      message: "Plantilla archived successfully",
      data: plantilla,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete plantilla",
      error: error.message,
    });
  }
};
