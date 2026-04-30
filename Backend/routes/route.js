import express from "express";
import mongoose from "mongoose";
import employeeRoutes from "./employeeRoutes.js";
import branchRoutes from "./branchRoutes.js";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import plantillaRoutes from "./plantillaRoutes.js";
import archiveRoutes from "./archiveRoutes.js";
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

export default router;
