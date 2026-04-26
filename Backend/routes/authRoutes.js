// routes/authRoutes.js
import express from "express";
import {
	login,
	getMe,
	createAdminUser,
	updateAdminUserAssignment,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", authMiddleware, createAdminUser);
router.post("/login", login);
router.post("/users", authMiddleware, createAdminUser);
router.put("/users/:userId", authMiddleware, updateAdminUserAssignment);
router.post("/admin-users", authMiddleware, createAdminUser);
router.put("/admin-users/:userId", authMiddleware, updateAdminUserAssignment);
router.get("/me", authMiddleware, getMe);

export default router;

