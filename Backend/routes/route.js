import express from "express";
import mongoose from "mongoose";
import employeeRoutes from "./employeeRoutes.js";
import departmentRoutes from "./departmentRoutes.js";
import positionRoutes from "./positionRoutes.js";

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
router.use("/departments", departmentRoutes);
router.use("/positions", positionRoutes);

export default router;
