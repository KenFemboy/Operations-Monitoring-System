import express from "express";
import * as plantillaController from "../controllers/plantillaController.js";

const router = express.Router();

// Create a new plantilla entry
router.post("/", plantillaController.createPlantilla);

// Get all plantilla entries
router.get("/", plantillaController.getAllPlantilla);

// Get plantilla by ID
router.get("/:id", plantillaController.getPlantillaById);

// Get plantilla entries by branch
router.get("/branch/:branchId", plantillaController.getPlantillaByBranch);

// Update plantilla entry
router.put("/:id", plantillaController.updatePlantilla);

// Delete plantilla entry
router.delete("/:id", plantillaController.deletePlantilla);

// Get plantilla stats for a branch
router.get("/stats/:branchId", plantillaController.getPlantillaStats);

// Update filled count for a position
router.patch("/:id/filled-count", plantillaController.updateFilledCount);

// Calculate total cost for a branch
router.get("/cost/:branchId", plantillaController.calculateTotalCost);

export default router;
