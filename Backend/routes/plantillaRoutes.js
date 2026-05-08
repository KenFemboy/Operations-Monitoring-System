import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  createPlantilla,
  getPlantillas,
  getPlantillaById,
  updatePlantilla,
  deletePlantilla,
} from "../controllers/plantillaController.js";

const router = express.Router();

router.use(protect);

router.post("/", allowRoles("superadmin", "admin"), createPlantilla);
router.get("/", allowRoles("superadmin", "admin", "console_user"), getPlantillas);
router.get("/:id", allowRoles("superadmin", "admin", "console_user"), getPlantillaById);
router.put("/:id", allowRoles("superadmin", "admin"), updatePlantilla);
router.delete("/:id", allowRoles("superadmin", "admin"), deletePlantilla);

export default router;