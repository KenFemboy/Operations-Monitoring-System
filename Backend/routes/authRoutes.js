// routes/authRoutes.js
import express from "express";
import {
  login,
  getMe,
  createAdminUser,
  updateAdminUserAssignment,
  deleteAdminUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireSuperAdmin } from "../middleware/superAdminMiddleware.js";

const router = express.Router();

router.post("/register", protect, requireSuperAdmin, createAdminUser);
router.post("/login", login);
router.post("/users", protect, requireSuperAdmin, createAdminUser);
router.put("/users/:userId", protect, requireSuperAdmin, updateAdminUserAssignment);
router.delete("/users/:userId", protect, requireSuperAdmin, deleteAdminUser);
router.post("/admin-users", protect, requireSuperAdmin, createAdminUser);
router.put("/admin-users/:userId", protect, requireSuperAdmin, updateAdminUserAssignment);
router.delete("/admin-users/:userId", protect, requireSuperAdmin, deleteAdminUser);
router.get("/me", protect, getMe);

export default router;

