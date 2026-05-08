import express from "express";
import {
  approvePayroll,
  generatePayrollController,
  getEmployeePayroll,
  getPayrolls,
  markAsPaid,
} from "../controllers/payrollController.js";
import { protect } from "../middleware/authMiddleware.js";
import { attachBranchScope } from "../middleware/accessControl.js";

const router = express.Router();

router.use(protect);
router.use(attachBranchScope);

router.post("/generate", generatePayrollController);
router.get("/", getPayrolls);
router.get("/employee/:employeeId", getEmployeePayroll);
router.patch("/:id/approve", approvePayroll);
router.patch("/:id/paid", markAsPaid);

export default router;
