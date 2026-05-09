import express from "express";
import superAdminBranchRoutes from "./superAdminBranchRoutes.js";
import superAdminDashboardRoutes from "./superAdminDashboardRoutes.js";
import superAdminEmployeeRoutes from "./superAdminEmployeeRoutes.js";
import superAdminFeedbackRoutes from "./superAdminFeedbackRoutes.js";
import superAdminInventoryRoutes from "./superAdminInventoryRoutes.js";
import superAdminPlantillaRoutes from "./superAdminPlantillaRoutes.js";
import superAdminReportRoutes from "./superAdminReportRoutes.js";
import superAdminSalesRoutes from "./superAdminSalesRoutes.js";
import superAdminUserRoutes from "./superAdminUserRoutes.js";

// Superadmin API group. Every child route can access all branches.
const router = express.Router();

router.use("/branches", superAdminBranchRoutes);
router.use("/users", superAdminUserRoutes);
router.use("/employees", superAdminEmployeeRoutes);
router.use("/inventory", superAdminInventoryRoutes);
router.use("/sales", superAdminSalesRoutes);
router.use("/reports", superAdminReportRoutes);
router.use("/dashboard", superAdminDashboardRoutes);
router.use("/feedback", superAdminFeedbackRoutes);
router.use("/plantilla", superAdminPlantillaRoutes);

export default router;
