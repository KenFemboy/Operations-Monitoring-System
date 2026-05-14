import express from "express";
import { uploadImage } from "../../middleware/uploadMiddleware.js";
import {
  createFeedback,
  getPublicFeedbackBranchConfig,
  getPublicFeedbackFormConfig,
} from "../../controllers/feedback/feedbackController.js";

// Public customer feedback routes. No admin token is required.
const router = express.Router();

router.get("/config", getPublicFeedbackFormConfig);
router.get("/config/:branchSlug", getPublicFeedbackBranchConfig);
router.post("/", uploadImage.single("image"), createFeedback);
router.post("/:branchSlug", uploadImage.single("image"), createFeedback);

export default router;
