import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import { branchScopeMiddleware } from "../../middleware/branchScopeMiddleware.js";
import {
  createBranch,
  getBranches,
  updateBranch,
  deleteBranch,
} from "../../controllers/branches/branchController.js";

// Superadmin branch management routes. Accessible by superadmin only.
const router = express.Router();

router.use(protect, allowRoles("super_admin", "superadmin"), branchScopeMiddleware);

router.post("/", createBranch);
router.get("/", getBranches);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);

export default router;
