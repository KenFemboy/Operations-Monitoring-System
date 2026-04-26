import express from "express";

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
getEmployeeFullDetails,

  createAttendance,
  getAttendance,

  createPlantilla,
  getPlantillas,

  createPayroll,
  getPayrolls,

  createLeave,
  getLeaves,
  updateLeaveStatus,
updateLeave,
  createContribution,
  getContributions,

  createIncidentReport,
  getIncidentReports,

  createNTE,
  getNTEs,


  updatePayrollStatus,
  
} from "../controllers/employeeController.js";

const router = express.Router();

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
router.post("/plantilla/create", createPlantilla);
router.get("/plantilla/list", getPlantillas);

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

// Notice to Explain
router.post("/nte/create", createNTE);
router.get("/nte/list", getNTEs);

export default router;