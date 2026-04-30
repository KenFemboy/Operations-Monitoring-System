import {
      createPlantilla,
  getPlantillas,
} from "../controllers/plantillaController.js";
import express from "express";

const router = express.Router();

router.post("/create", createPlantilla);
router.get("/list", getPlantillas);

export default router;