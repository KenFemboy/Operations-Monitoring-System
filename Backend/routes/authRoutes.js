// routes/authRoutes.js
import express from "express";
import {
	login,
	getMe,
	tempSuperAdminLogin,
	createAdminUser,
	updateAdminUserAssignment,
} from "../controllers/authController.js";
import { authMiddleware, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", authMiddleware, authorize("super_admin"), createAdminUser);
router.post("/login", login);
router.post("/temp-superadmin-login", tempSuperAdminLogin);
router.post("/admin-users", authMiddleware, authorize("super_admin"), createAdminUser);
router.put("/admin-users/:userId", authMiddleware, authorize("super_admin"), updateAdminUserAssignment);
router.get("/me", authMiddleware, getMe);

export default router;

