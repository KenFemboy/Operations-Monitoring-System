import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import { branchScopeMiddleware } from "../../middleware/branchScopeMiddleware.js";
import { uploadEmployeePhoto } from "../../middleware/imageUploadMiddleware.js";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeFullDetails,
  createAttendance,
  getAttendance,
  createPayroll,
  getPayrolls,
  updatePayrollStatus,
  createLeave,
  getLeaves,
  updateLeaveStatus,
  updateLeave,
  createContribution,
  getContributions,
  createIncidentReport,
  getIncidentReports,
  updateIncidentReportStatus,
  createNTE,
  getNTEs,
  updateNTEStatus,
} from "../../controllers/employees/employeeController.js";

// Superadmin employee and HR routes. Accessible by superadmin across all branches.
const router = express.Router();

router.use(protect, allowRoles("super_admin", "superadmin"), branchScopeMiddleware);

router.post("/", uploadEmployeePhoto, createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.get("/:id/details", getEmployeeFullDetails);
router.put("/:id", uploadEmployeePhoto, updateEmployee);
router.delete("/:id", deleteEmployee);

router.post("/attendance/create", createAttendance);
router.get("/attendance/list", getAttendance);

router.post("/payroll/create", createPayroll);
router.get("/payroll/list", getPayrolls);
router.put("/payroll/:id/status", updatePayrollStatus);

router.post("/leave/create", createLeave);
router.get("/leave/list", getLeaves);
router.put("/leave/:id", updateLeave);
router.put("/leave/:id/status", updateLeaveStatus);

router.post("/contribution/create", createContribution);
router.get("/contribution/list", getContributions);

router.post("/ir/create", createIncidentReport);
router.get("/ir/list", getIncidentReports);
router.put("/ir/:id/status", updateIncidentReportStatus);

router.post("/nte/create", createNTE);
router.get("/nte/list", getNTEs);
router.put("/nte/:id/status", updateNTEStatus);

export default router;
