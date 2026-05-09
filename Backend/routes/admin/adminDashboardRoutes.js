import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import { branchScopeMiddleware } from "../../middleware/branchScopeMiddleware.js";
import {
  getOverallSummary,
  getSalesAnalytics,
  getEmployeeAnalytics,
  getAttendancePayrollAnalytics,
  getInventoryAnalytics,
  getFeedbackAnalytics,
  getIRNTEAnalytics,
  getLeavePlantillaAnalytics,
} from "../../controllers/dashboard/dashboardController.js";

// Admin dashboard routes. Accessible by admin/console_user for assigned branch only.
const router = express.Router();

router.use(protect, allowRoles("admin", "console_user"), branchScopeMiddleware);

router.get("/overall", getOverallSummary);
router.get("/sales", getSalesAnalytics);
router.get("/employees", getEmployeeAnalytics);
router.get("/attendance-payroll", getAttendancePayrollAnalytics);
router.get("/inventory", getInventoryAnalytics);
router.get("/feedback", getFeedbackAnalytics);
router.get("/ir-nte", getIRNTEAnalytics);
router.get("/leave-plantilla", getLeavePlantillaAnalytics);

export default router;
