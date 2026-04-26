// routes/employeeRoutes.js
import express from "express";
import * as controller from "../controllers/employeeController.js";

const router = express.Router();

router.post("/create", controller.createEmployee);
router.get("/get-all", controller.getEmployees);
router.get("/by-branch/:branchId", controller.getEmployeesByBranchId);

router.put("/update/:id", controller.updateEmployee);

export default router;