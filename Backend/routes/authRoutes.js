// routes/authRoutes.js
import express from "express";
import {
	createUser,
	login,
	getMe,
	tempSuperAdminLogin,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.post("/temp-superadmin-login", tempSuperAdminLogin);
router.get("/me", authMiddleware, getMe);

export default router;

