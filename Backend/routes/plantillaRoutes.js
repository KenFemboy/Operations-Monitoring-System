import express from "express";
import {
  createPlantilla,
  deletePlantilla,
  getPlantillasByBranch,
  updatePlantilla,
} from "../controllers/plantillaController.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  requireBranchAccessFromBody,
  requireBranchAccessFromParam,
} from "../middleware/plantillaBranchAccess.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", requireBranchAccessFromBody("branchId"), createPlantilla);
router.get(
  "/branch/:branchId",
  requireBranchAccessFromParam("branchId"),
  getPlantillasByBranch
);
router.put("/:id", updatePlantilla);
router.delete("/:id", deletePlantilla);

export default router;
