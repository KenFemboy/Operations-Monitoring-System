import express from "express";
import {
  createFeedback,
  getPublicFeedbackBranchConfig,
  getPublicFeedbackFormConfig,
} from "../../controllers/feedback/feedbackController.js";

// Public customer feedback routes. No admin token is required.
const router = express.Router();

router.get("/config", getPublicFeedbackFormConfig);
router.get("/config/:branchSlug", getPublicFeedbackBranchConfig);
router.post("/", createFeedback);
router.post("/:branchSlug", createFeedback);

export default router;
