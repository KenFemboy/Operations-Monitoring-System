// routes/employeeRoutes.js
import express from "express";
import * as controller from "../controllers/employeeController.js";
import { authMiddleware } from "../middleware/auth.js";
import { attachBranchScope } from "../middleware/accessControl.js";

const router = express.Router();

router.use(authMiddleware);
router.use(attachBranchScope);

router.post("/create", controller.createEmployee);
router.get("/get-all", controller.getEmployees);
router.get("/by-branch/:branchId", controller.getEmployeesByBranchId);

router.put("/update/:id", controller.updateEmployee);
router.patch("/:id/deactivate", controller.deactivateEmployee);

export default router;
