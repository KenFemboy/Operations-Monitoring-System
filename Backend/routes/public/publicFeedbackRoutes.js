import express from "express";
import {
  createFeedback,
  getPublicFeedbackFormConfig,
} from "../../controllers/feedback/feedbackController.js";

// Public customer feedback routes. No admin token is required.
const router = express.Router();

router.get("/config", getPublicFeedbackFormConfig);
router.post("/", createFeedback);

export default router;
