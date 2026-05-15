import express from "express";
import { uploadFeedbackImage } from "../../middleware/uploadMiddleware.js";
import {
  createFeedback,
  getPublicFeedbackBranchConfig,
  getPublicFeedbackFormConfig,
} from "../../controllers/feedback/feedbackController.js";
import { publicFeedbackRateLimit } from "../../middleware/rateLimitMiddleware.js";

// Public customer feedback routes. No admin token is required.
const router = express.Router();

router.get("/config", getPublicFeedbackFormConfig);
router.get("/config/:branchSlug", getPublicFeedbackBranchConfig);
router.post("/", publicFeedbackRateLimit, uploadFeedbackImage.single("image"), createFeedback);
router.post("/:branchSlug", publicFeedbackRateLimit, uploadFeedbackImage.single("image"), createFeedback);

export default router;
