import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  getOverallSummary,
  getSalesAnalytics,
  getEmployeeAnalytics,
  getAttendancePayrollAnalytics,
  getInventoryAnalytics,
  getFeedbackAnalytics,
  getIRNTEAnalytics,
  getLeavePlantillaAnalytics,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.use(protect);

router.get("/overall", allowRoles("superadmin", "admin", "console_user"), getOverallSummary);
router.get("/sales", allowRoles("superadmin", "admin", "console_user"), getSalesAnalytics);
router.get("/employees", allowRoles("superadmin", "admin", "console_user"), getEmployeeAnalytics);
router.get("/attendance-payroll", allowRoles("superadmin", "admin", "console_user"), getAttendancePayrollAnalytics);
router.get("/inventory", allowRoles("superadmin", "admin", "console_user"), getInventoryAnalytics);
router.get("/feedback", allowRoles("superadmin", "admin", "console_user"), getFeedbackAnalytics);
router.get("/ir-nte", allowRoles("superadmin", "admin", "console_user"), getIRNTEAnalytics);
router.get("/leave-plantilla", allowRoles("superadmin", "admin", "console_user"), getLeavePlantillaAnalytics);

export default router;