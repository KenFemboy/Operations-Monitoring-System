import Feedback from "../../models/Feedback.js";
import Branch from "../../models/Branch.js";
import { isSuperAdmin, getUserBranchId } from "../../middleware/accessControl.js";
import { getBranchFilter } from "../../utils/branchFilter.js";
import { uploadToSupabase } from "../../utils/uploadToSupabase.js";
import { deleteFromSupabase } from "../../utils/deleteFromSupabase.js";

const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const branchSlugCandidates = (branch) => {
  const names = [
    branch.branchName,
    branch.location,
    branch.branchName?.replace(/\s+branch$/i, ""),
  ];

  return names.filter(Boolean).map(slugify);
};

const formatTimestampForFilename = (value = new Date()) =>
  new Date(value)
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replace(/[:.]/g, "-");

const buildFeedbackImageFilenameBase = ({ dateUploaded, branchName }) =>
  `${formatTimestampForFilename(dateUploaded)}_${branchName}`;

const resolveBranchBySlug = async (branchSlug) => {
  if (!branchSlug) return null;

  const slug = slugify(branchSlug);
  const branches = await Branch.find({ status: { $ne: "inactive" } });

  return (
    branches.find((branch) => branchSlugCandidates(branch).includes(slug)) ||
    null
  );
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

const applyBranchFilter = async (filter, branch) => {
  if (!branch || branch === "all") {
    return;
  }

  const resolvedBranch = await resolveBranch({ branch });
  filter.branch = resolvedBranch._id;
};

export const createFeedback = async (req, res) => {
  let uploadedImage = null;

  try {
    const {
      customerName,
      branch,
      branchId,
      branchName,
      branchSlug,
      mealSession,
      serviceType,
      rating,
      review,
      comment,
    } = req.body;
    const selectedBranchSlug = req.params?.branchSlug || branchSlug;
    const selectedServiceType = mealSession || serviceType;
    const selectedComment = (review || comment || "").trim();

    if (
      !selectedServiceType ||
      !rating ||
      (!req.user && !branch && !branchId && !branchName && !selectedBranchSlug)
    ) {
      return res.status(400).json({
        success: false,
        message: "Branch, service type, and rating are required",
      });
    }

    if (!["Lunch", "Dinner"].includes(selectedServiceType)) {
      return res.status(400).json({
        success: false,
        message: "Service type must be Lunch or Dinner",
      });
    }

    const numericRating = Number(rating);

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (selectedComment.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Comment must be 120 characters or less",
      });
    }

    let resolvedBranch = null;

    if (!req.user || isSuperAdmin(req.user)) {
      resolvedBranch =
        (await resolveBranchBySlug(selectedBranchSlug)) ||
        (await resolveBranch({ branch, branchId, branchName }));
    } else {
      const userBranchId = getUserBranchId(req.user);
      if (!userBranchId) {
        const error = new Error("User has no branch assigned");
        error.statusCode = 400;
        throw error;
      }

      resolvedBranch = await Branch.findById(userBranchId);
      if (!resolvedBranch) {
        const error = new Error("Valid branch is required");
        error.statusCode = 400;
        throw error;
      }
    }

    const dateUploaded = new Date();
    uploadedImage = req.file
      ? await uploadToSupabase(req.file, "feedback", {
          filenameBase: buildFeedbackImageFilenameBase({
            dateUploaded,
            branchName: resolvedBranch.branchName,
          }),
          extension: "webp",
        })
      : null;

    const feedback = await Feedback.create({
      customerName: customerName || "Anonymous",
      branch: resolvedBranch._id,
      mealSession: selectedServiceType,
      serviceType: selectedServiceType,
      rating: numericRating,
      review: selectedComment,
      comment: selectedComment,
      concernPhoto: uploadedImage?.url || "",
      imageUrl: uploadedImage?.url || "",
      imagePath: uploadedImage?.path || "",
    });

    await feedback.populate("branch", "branchName location address status");

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    if (uploadedImage?.path) {
      await deleteFromSupabase(uploadedImage.path).catch((deleteError) => {
        console.error("Failed to delete unassigned feedback image:", deleteError);
      });
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message === "Image upload failed"
          ? "Image upload failed"
          : "Failed to submit feedback",
      error: error.message,
    });
  }
};

export const getPublicFeedbackBranchConfig = async (req, res) => {
  try {
    const branch = await resolveBranchBySlug(req.params.branchSlug);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Feedback branch not found",
      });
    }

    res.status(200).json({
      success: true,
      branch,
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load feedback branch",
      error: error.message,
    });
  }
};

export const getPublicFeedbackFormConfig = async (_req, res) => {
  try {
    const branches = await Branch.find({ status: { $ne: "inactive" } })
      .select("branchName location address status")
      .sort({ branchName: 1 });

    res.status(200).json({
      success: true,
      branches,
      data: branches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load feedback form configuration",
      error: error.message,
    });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const { startDate, endDate, branch, mealSession } = req.query;

    const filter = { isArchived: { $ne: true } };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
        $lte: new Date(`${endDate}T23:59:59.999Z`),
      };
    }

    // prefer user branch when not superadmin
    const branchFilter = getBranchFilter(req);
    if (Object.keys(branchFilter).length) {
      filter.branch = branchFilter.branch;
    } else if (branch && branch !== "all") {
      await applyBranchFilter(filter, branch);
    }

    if (mealSession && mealSession !== "all") {
      filter.mealSession = mealSession;
    }

    const feedbacks = await Feedback.find(filter)
      .populate("branch", "branchName location address status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to fetch feedbacks",
      error: error.message,
    });
  }
};

export const getAverageRatingByBranch = async (req, res) => {
  try {
    const { startDate, endDate, branch, mealSession } = req.query;

    const match = { isArchived: { $ne: true } };

    if (startDate && endDate) {
      match.createdAt = {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
        $lte: new Date(`${endDate}T23:59:59.999Z`),
      };
    }

    if (mealSession && mealSession !== "all") {
      match.mealSession = mealSession;
    }

    const branchFilter = getBranchFilter(req);
    const matchWithBranch = { ...match, ...branchFilter };

    if (!Object.keys(branchFilter).length && branch && branch !== "all") {
      await applyBranchFilter(matchWithBranch, branch);
    }

    const summary = await Feedback.aggregate([
      { $match: matchWithBranch },
      {
        $group: {
          _id: "$branch",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "_id",
          foreignField: "_id",
          as: "branch",
        },
      },
      {
        $unwind: {
          path: "$branch",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          branchId: "$_id",
          branch: { $ifNull: ["$branch.branchName", "Unknown Branch"] },
          averageRating: { $round: ["$averageRating", 2] },
          totalReviews: 1,
        },
      },
      { $sort: { branch: 1 } },
    ]);

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to fetch average rating by branch",
      error: error.message,
    });
  }
};

export const getAverageRatingByMonth = async (req, res) => {
  try {
    const { startDate, endDate, branch, mealSession } = req.query;

    const match = { isArchived: { $ne: true } };

    if (startDate && endDate) {
      match.createdAt = {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
        $lte: new Date(`${endDate}T23:59:59.999Z`),
      };
    }

    const branchFilter = getBranchFilter(req);
    if (Object.keys(branchFilter).length) {
      Object.assign(match, branchFilter);
    } else if (branch && branch !== "all") {
      await applyBranchFilter(match, branch);
    }

    if (mealSession && mealSession !== "all") {
      match.mealSession = mealSession;
    }

    const summary = await Feedback.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          averageRating: { $round: ["$averageRating", 2] },
          totalReviews: 1,
        },
      },
      { $sort: { year: -1, month: -1 } },
    ]);

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to fetch average rating by month",
      error: error.message,
    });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id, isArchived: { $ne: true }, ...getBranchFilter(req) };

    const feedback = await Feedback.findOne(filter);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    feedback.isArchived = true;
    feedback.archivedAt = new Date();
    feedback.archivedBy = req.user?._id || req.user?.id || null;
    feedback.archiveReason = req.body?.reason || "No reason provided";
    await feedback.save();

    res.status(200).json({
      success: true,
      message: "Feedback archived successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to archive feedback",
      error: error.message,
    });
  }
};
