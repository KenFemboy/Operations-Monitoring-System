import express from "express";
import { authMiddleware } from "../middleware/auth.js";

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

  
} from "../controllers/employeeController.js";

const router = express.Router();

router.use(authMiddleware);

// Employee
router.post("/", createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.get("/:id/details", getEmployeeFullDetails);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

// Attendance
router.post("/attendance/create", createAttendance);
router.get("/attendance/list", getAttendance);

// Plantilla


// Payroll
router.post("/payroll/create", createPayroll);
router.get("/payroll/list", getPayrolls);
router.put("/payroll/:id/status", updatePayrollStatus);
// Leave
router.post("/leave/create", createLeave);
router.get("/leave/list", getLeaves);
router.put("/leave/:id", updateLeave);
router.put("/leave/:id/status", updateLeaveStatus);

// Contributions
router.post("/contribution/create", createContribution);
router.get("/contribution/list", getContributions);

// Incident Reports
router.post("/ir/create", createIncidentReport);
router.get("/ir/list", getIncidentReports);
router.put("/ir/:id/status", updateIncidentReportStatus);
// Notice to Explain
router.post("/nte/create", createNTE);
router.get("/nte/list", getNTEs);
router.put("/nte/:id/status", updateNTEStatus);

export default router;