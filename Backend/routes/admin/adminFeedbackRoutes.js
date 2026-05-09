import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import { branchScopeMiddleware } from "../../middleware/branchScopeMiddleware.js";
import {
  createFeedback,
  getFeedbacks,
  getAverageRatingByBranch,
  getAverageRatingByMonth,
  deleteFeedback,
} from "../../controllers/feedback/feedbackController.js";

// Admin feedback routes. Accessible by admin/console_user for assigned branch only.
const router = express.Router();

router.use(protect, allowRoles("admin", "console_user"), branchScopeMiddleware);

router.post("/", createFeedback);
router.get("/", getFeedbacks);
router.get("/summary/by-branch", getAverageRatingByBranch);
router.get("/summary/by-month", getAverageRatingByMonth);
router.delete("/:id", deleteFeedback);

export default router;
