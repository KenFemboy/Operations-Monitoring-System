import express from "express";
import mongoose from "mongoose";
import employeeRoutes from "./employeeRoutes.js";
import branchRoutes from "./branchRoutes.js";
import payrollRoutes from "./payrollRoutes.js";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
// import plantillaRoutes from "./plantillaRoutes.js";
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
router.use("/empoyee", employeeRoutes);
router.use("/branches", branchRoutes);
router.use("/payrolls", payrollRoutes);
// router.use("/plantilla", plantillaRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
