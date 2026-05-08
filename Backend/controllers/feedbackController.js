import Feedback from "../models/Feedback.js";
import Branch from "../models/Branch.js";
import { isSuperAdmin, getUserBranchId } from "../middleware/accessControl.js";
import { getBranchFilter } from "../utils/branchFilter.js";

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
  try {
    const { customerName, branch, branchId, branchName, mealSession, rating, review } = req.body;

    if ((!isSuperAdmin(req.user) && !getUserBranchId(req.user)) && (!branch && !branchId && !branchName)) {
      return res.status(400).json({
        success: false,
        message: "Branch, meal session, rating, and review are required",
      });
    }

    if (!["Lunch", "Dinner"].includes(mealSession)) {
      return res.status(400).json({
        success: false,
        message: "Meal session must be Lunch or Dinner",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (review.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Review must be 120 characters or less",
      });
    }

    let resolvedBranch = null;

    if (isSuperAdmin(req.user)) {
      resolvedBranch = await resolveBranch({ branch, branchId, branchName });
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

    const feedback = await Feedback.create({
      customerName: customerName || "Anonymous",
      branch: resolvedBranch._id,
      mealSession,
      rating,
      review,
    });

    await feedback.populate("branch", "branchName location address status");

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const { startDate, endDate, branch, mealSession } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
        $lte: new Date(`${endDate}T23:59:59.999Z`),
      };
    }

    // prefer user branch when not superadmin
    const branchFilter = getBranchFilter(req.user);
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

    const match = {};

    if (startDate && endDate) {
      match.createdAt = {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
        $lte: new Date(`${endDate}T23:59:59.999Z`),
      };
    }

    if (mealSession && mealSession !== "all") {
      match.mealSession = mealSession;
    }

    const branchFilter = getBranchFilter(req.user);
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
    const { branch, mealSession } = req.query;

    const match = {};

    const branchFilter = getBranchFilter(req.user);
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
    const filter = { _id: id, ...getBranchFilter(req.user) };

    const feedback = await Feedback.findOneAndDelete(filter);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
      error: error.message,
    });
  }
};
