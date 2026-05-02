import express from "express";
import {
  createFeedback,
  getFeedbacks,
  getAverageRatingByBranch,
  getAverageRatingByMonth,
  deleteFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", createFeedback);
router.get("/", getFeedbacks);

router.get("/summary/by-branch", getAverageRatingByBranch);
router.get("/summary/by-month", getAverageRatingByMonth);

router.delete("/:id", deleteFeedback);

export default router;