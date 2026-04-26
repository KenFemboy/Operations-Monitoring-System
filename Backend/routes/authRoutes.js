// routes/authRoutes.js
import express from "express";
import {
	login,
	getMe,
	createAdminUser,
	updateAdminUserAssignment,
	deleteAdminUser,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", authMiddleware, createAdminUser);
router.post("/login", login);
router.post("/users", authMiddleware, createAdminUser);
router.put("/users/:userId", authMiddleware, updateAdminUserAssignment);
router.delete("/users/:userId", authMiddleware, deleteAdminUser);
router.post("/admin-users", authMiddleware, createAdminUser);
router.put("/admin-users/:userId", authMiddleware, updateAdminUserAssignment);
router.delete("/admin-users/:userId", authMiddleware, deleteAdminUser);
router.get("/me", authMiddleware, getMe);

export default router;

