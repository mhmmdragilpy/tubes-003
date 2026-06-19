import { Router } from "express";
import { login, getProfile, register } from "../controllers/authController";
import { authMiddleware, roleGuard } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, getProfile);

// Admin-only routes
router.post("/register", authMiddleware, roleGuard("ADMIN_HR"), register);

export default router;
