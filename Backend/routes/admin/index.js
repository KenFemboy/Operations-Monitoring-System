import express from "express";
import adminBranchRoutes from "./adminBranchRoutes.js";
import adminDashboardRoutes from "./adminDashboardRoutes.js";
import adminEmployeeRoutes from "./adminEmployeeRoutes.js";
import adminFeedbackRoutes from "./adminFeedbackRoutes.js";
import adminInventoryRoutes from "./adminInventoryRoutes.js";
import adminPlantillaRoutes from "./adminPlantillaRoutes.js";
import adminSalesRoutes from "./adminSalesRoutes.js";

// Admin API group. Every child route is branch-scoped.
const router = express.Router();

router.use("/branches", adminBranchRoutes);
router.use("/employees", adminEmployeeRoutes);
router.use("/inventory", adminInventoryRoutes);
router.use("/sales", adminSalesRoutes);
router.use("/feedback", adminFeedbackRoutes);
router.use("/dashboard", adminDashboardRoutes);
router.use("/plantilla", adminPlantillaRoutes);

export default router;
