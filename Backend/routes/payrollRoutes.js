import express from "express";
import {
  approvePayroll,
  generatePayrollController,
  getEmployeePayroll,
  getPayrolls,
  markAsPaid,
} from "../controllers/payrollController.js";
import { authMiddleware } from "../middleware/auth.js";
import { attachBranchScope } from "../middleware/accessControl.js";

const router = express.Router();

router.use(authMiddleware);
router.use(attachBranchScope);

router.post("/generate", generatePayrollController);
router.get("/", getPayrolls);
router.get("/employee/:employeeId", getEmployeePayroll);
router.patch("/:id/approve", approvePayroll);
router.patch("/:id/paid", markAsPaid);

export default router;
