import express from "express";
import * as departmentController from "../controllers/departmentController.js";

const router = express.Router();

router.post("/create", departmentController.createDepartment);
router.get("/get-all", departmentController.getDepartments);

export default router;
