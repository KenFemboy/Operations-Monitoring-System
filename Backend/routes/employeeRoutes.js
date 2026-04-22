// routes/employeeRoutes.js
import express from "express";
import * as controller from "../controllers/employeeControllers.js";

const router = express.Router();

router.post("/create", controller.createEmployee);
router.get("/get-all", controller.getEmployees);

export default router;