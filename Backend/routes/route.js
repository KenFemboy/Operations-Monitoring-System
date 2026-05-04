import express from "express";
import mongoose from "mongoose";
import employeeRoutes from "./employeeRoutes.js";
import branchRoutes from "./branchRoutes.js";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import plantillaRoutes from "./plantillaRoutes.js";
import archiveRoutes from "./archiveRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";
import saleRoutes from "./saleRoutes.js";
import feedbackRoutes from "./feedbackRoutes.js";

import dashboardRoutes from "./dashboardRoutes.js";
const router = express.Router();

router.get("/health", (_req, res) => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const dbState = mongoose.connection.readyState;
  const dbConnected = dbState === 1;

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    service: "operations-monitoring-api",
    db: states[dbState] || "unknown",
  });
});

router.use("/employees", employeeRoutes);
router.use("/branches", branchRoutes);
router.use("/plantilla", plantillaRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/archive", archiveRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/sales", saleRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/dashboard", dashboardRoutes);
export default router;
