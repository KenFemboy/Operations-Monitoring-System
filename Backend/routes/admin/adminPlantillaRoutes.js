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

// Admin plantilla routes. Accessible by admin/console_user for assigned branch only.
const router = express.Router();

router.use(protect, allowRoles("admin", "console_user"), branchScopeMiddleware);

router.post("/", createPlantilla);
router.get("/", getPlantillas);
router.get("/:id", getPlantillaById);
router.put("/:id", updatePlantilla);
router.delete("/:id", deletePlantilla);

export default router;
