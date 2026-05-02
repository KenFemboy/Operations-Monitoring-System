import express from "express";

import {
  createPlantilla,
  getPlantillas,
  getPlantillaById,
  updatePlantilla,
  deletePlantilla,
} from "../controllers/plantillaController.js";

const router = express.Router();

router.post("/", createPlantilla);
router.get("/", getPlantillas);
router.get("/:id", getPlantillaById);
router.put("/:id", updatePlantilla);
router.delete("/:id", deletePlantilla);

export default router;