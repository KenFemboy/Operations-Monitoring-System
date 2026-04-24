
import express from "express";
import {
  generatePayrollController,
  getPayrolls,
  getEmployeePayroll,
  updatePayrollStatus,
} from "../controllers/payrollController.js";

const router = express.Router();

router.post("/generate", generatePayrollController);
router.get("/", getPayrolls);
router.get("/employee/:employeeId", getEmployeePayroll);
router.patch("/:id/status", updatePayrollStatus);
export default router;