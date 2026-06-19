import { Router } from "express";
import { getAllPeriode, createPeriode, activatePeriode, closePeriode } from "../controllers/periodeController";
import { authMiddleware, roleGuard } from "../middleware/auth";

const router = Router();

// Semua user yang login bisa melihat daftar periode
router.get("/", authMiddleware, getAllPeriode);

// Hanya Admin HR yang bisa mengelola periode
router.post("/", authMiddleware, roleGuard("ADMIN_HR"), createPeriode);
router.put("/:id/activate", authMiddleware, roleGuard("ADMIN_HR"), activatePeriode);
router.put("/:id/close", authMiddleware, roleGuard("ADMIN_HR"), closePeriode);

export default router;
