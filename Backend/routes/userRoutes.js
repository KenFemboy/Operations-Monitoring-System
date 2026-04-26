import express from "express";
import {
  getAllUsers,
  getProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// self profile
router.get("/profile", authMiddleware, getProfile);

router.get("/", authMiddleware, getAllUsers);

export default router;
