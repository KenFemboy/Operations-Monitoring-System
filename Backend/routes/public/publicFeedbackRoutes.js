import express from "express";
import { uploadFeedbackImage } from "../../middleware/uploadMiddleware.js";
import {
  createFeedback,
  getPublicFeedbackBranchConfig,
  getPublicFeedbackFormConfig,
} from "../../controllers/feedback/feedbackController.js";

// Public customer feedback routes. No admin token is required.
const router = express.Router();

router.get("/config", getPublicFeedbackFormConfig);
router.get("/config/:branchSlug", getPublicFeedbackBranchConfig);
router.post("/", uploadFeedbackImage.single("image"), createFeedback);
router.post("/:branchSlug", uploadFeedbackImage.single("image"), createFeedback);

export default router;
