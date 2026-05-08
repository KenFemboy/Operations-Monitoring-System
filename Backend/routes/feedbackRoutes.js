import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  createFeedback,
  getFeedbacks,
  getAverageRatingByBranch,
  getAverageRatingByMonth,
  deleteFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.use(protect);

router.post("/", allowRoles("super_admin", "superadmin", "admin", "console_user"), createFeedback);
router.get("/", allowRoles("super_admin", "superadmin", "admin", "console_user"), getFeedbacks);

router.get("/summary/by-branch", allowRoles("super_admin", "superadmin", "admin", "console_user"), getAverageRatingByBranch);
router.get("/summary/by-month", allowRoles("super_admin", "superadmin", "admin", "console_user"), getAverageRatingByMonth);

router.delete("/:id", allowRoles("super_admin", "superadmin", "admin", "console_user"), deleteFeedback);

export default router;
