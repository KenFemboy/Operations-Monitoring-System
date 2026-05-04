import express from "express";
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

router.get("/overall", getOverallSummary);
router.get("/sales", getSalesAnalytics);
router.get("/employees", getEmployeeAnalytics);
router.get("/attendance-payroll", getAttendancePayrollAnalytics);
router.get("/inventory", getInventoryAnalytics);
router.get("/feedback", getFeedbackAnalytics);
router.get("/ir-nte", getIRNTEAnalytics);
router.get("/leave-plantilla", getLeavePlantillaAnalytics);

export default router;