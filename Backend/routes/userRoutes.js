import express from "express";

import {
  createAdminUser,
  getBranchAdmins,
  updateAdminUserAssignment,
  deleteAdminUser,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireSuperAdmin } from "../middleware/superAdminMiddleware.js";

const router = express.Router();

router.get("/", protect, requireSuperAdmin, getBranchAdmins);
router.post("/", protect, requireSuperAdmin, createAdminUser);
router.put("/:userId", protect, requireSuperAdmin, updateAdminUserAssignment);
router.delete("/:userId", protect, requireSuperAdmin, deleteAdminUser);

export default router;