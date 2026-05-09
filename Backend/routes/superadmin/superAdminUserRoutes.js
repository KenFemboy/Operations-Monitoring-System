import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import {
  createAdminUser,
  getBranchAdmins,
  updateAdminUserAssignment,
  deleteAdminUser,
} from "../../controllers/users/superAdminUserController.js";

// Superadmin user management routes. Accessible by superadmin only.
const router = express.Router();

router.use(protect, allowRoles("super_admin", "superadmin"));

router.get("/", getBranchAdmins);
router.post("/", createAdminUser);
router.put("/:userId", updateAdminUserAssignment);
router.delete("/:userId", deleteAdminUser);

export default router;
