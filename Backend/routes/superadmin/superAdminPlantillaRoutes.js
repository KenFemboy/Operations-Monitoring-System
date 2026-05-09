import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import { branchScopeMiddleware } from "../../middleware/branchScopeMiddleware.js";
import {
  createPlantilla,
  getPlantillas,
  getPlantillaById,
  updatePlantilla,
  deletePlantilla,
} from "../../controllers/hr/plantillaController.js";

// Superadmin plantilla routes. Accessible by superadmin across all branches.
const router = express.Router();

router.use(protect, allowRoles("super_admin", "superadmin"), branchScopeMiddleware);

router.post("/", createPlantilla);
router.get("/", getPlantillas);
router.get("/:id", getPlantillaById);
router.put("/:id", updatePlantilla);
router.delete("/:id", deletePlantilla);

export default router;
