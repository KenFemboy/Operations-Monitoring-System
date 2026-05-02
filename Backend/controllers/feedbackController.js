import Feedback from "../models/Feedback.js";

export const createFeedback = async (req, res) => {
  try {
    const { customerName, rating, review } = req.body;

    if (!rating || !review) {
      return res.status(400).json({
        success: false,
        message: "Rating and review are required",
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

    const feedback = await Feedback.create({
      customerName: customerName || "Anonymous",
      rating,
      review,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
        $lte: new Date(`${endDate}T23:59:59.999Z`),
      };
    }

    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedbacks",
      error: error.message,
    });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);

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