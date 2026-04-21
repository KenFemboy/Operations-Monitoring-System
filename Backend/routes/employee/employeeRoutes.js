// routes/employeeRoutes.js
import express from "express";
import * as controller from "../../controllers/employeeControllers.js";

const router = express.Router();
router.post("/create", controller.createEmployee);
router.get("/get-all", controller.getEmployees);
router.get("/get-by-id/:id", controller.getEmployeeById);
router.put("/update/:id", controller.updateEmployee);
router.delete("/delete/:id", controller.deleteEmployee);

export default router;