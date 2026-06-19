import { Router } from "express";
import { getMyForms, getFormDetail, submitPenilaian, getHasilPenilaian } from "../controllers/penilaianController";
import { authMiddleware, roleGuard } from "../middleware/auth";

const router = Router();

// Semua rute penilaian membutuhkan autentikasi
router.use(authMiddleware);

// Mendapatkan daftar form milik user yang sedang login
router.get("/form/periode/:periodeId", getMyForms);

// Melihat detail form dan soal
router.get("/form/detail/:formId", getFormDetail);

// Submit jawaban form penilaian (Bisa Karyawan atau Atasan)
router.post("/submit/:formId", roleGuard("KARYAWAN", "ATASAN"), submitPenilaian);

// Mendapatkan hasil agregasi 360 derajat (Hanya Manajemen, Admin, atau Atasan)
router.get("/hasil/:karyawanId/:periodeId", roleGuard("MANAJEMEN", "ADMIN_HR", "ATASAN"), getHasilPenilaian);

export default router;
