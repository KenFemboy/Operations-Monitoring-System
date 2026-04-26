import express from "express";
import {
  getAttendanceByEmployee,
  getMonthlyAttendanceSummary,
  timeIn,
  timeOut,
} from "../controllers/attendanceController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/time-in", timeIn);
router.post("/time-out", timeOut);
router.get("/employee/:employeeId", getAttendanceByEmployee);
router.get("/employee/:employeeId/monthly-summary", getMonthlyAttendanceSummary);

export default router;
