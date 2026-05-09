import express from "express";
import { createUser, getMe, login } from "../../controllers/auth/authController.js";
import { protect } from "../../middleware/authMiddleware.js";

// Public auth routes. Login/register are public; /me requires a valid JWT.
const router = express.Router();

router.post("/login", login);
router.post("/register", createUser);
router.get("/me", protect, getMe);

export default router;
