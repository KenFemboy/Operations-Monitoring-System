import express from "express";
import {
  getAllUsers,
  getProfile,
} from "../controllers/userController.js";
import { authMiddleware, authorize } from "../middleware/auth.js";

const router = express.Router();

// self profile
router.get("/profile", authMiddleware, getProfile);

// admin only
router.get("/", authMiddleware, authorize("admin", "super_admin"), getAllUsers);

export default router;