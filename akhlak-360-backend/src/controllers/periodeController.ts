import { Request, Response } from "express";
import prisma from "../config/database";

/**
 * GET /api/periode
 * Menampilkan semua periode penilaian.
 */
export async function getAllPeriode(req: Request, res: Response): Promise<void> {
  try {
    const periodes = await prisma.periodePenilaian.findMany({
      orderBy: { tgl_mulai: "desc" },
      include: {
        adminHR: { include: { user: { select: { nama: true } } } },
      },
    });
    res.json({ success: true, data: periodes });
  } catch (error) {
    console.error("GetAllPeriode error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}

/**
 * POST /api/periode
 * Membuat periode penilaian baru (Admin HR only).
 */
export async function createPeriode(req: Request, res: Response): Promise<void> {
  try {
    const { nama_periode, tgl_mulai, tgl_selesai } = req.body;

    if (!nama_periode || !tgl_mulai || !tgl_selesai) {
      res.status(400).json({ success: false, message: "nama_periode, tgl_mulai, dan tgl_selesai wajib diisi." });
      return;
    }

    // Cari Admin HR dari user yang login
    const admin = await prisma.adminHR.findUnique({ where: { id_user: req.user!.id_user } });
    if (!admin) {
      res.status(403).json({ success: false, message: "Hanya Admin HR yang dapat membuat periode." });
      return;
    }

    const periode = await prisma.periodePenilaian.create({
      data: {
        id_admin: admin.id_admin,
        nama_periode,
        tgl_mulai: new Date(tgl_mulai),
        tgl_selesai: new Date(tgl_selesai),
        status: "DRAFT",
      },
    });

    res.status(201).json({ success: true, message: "Periode berhasil dibuat.", data: periode });
  } catch (error) {
    console.error("CreatePeriode error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}

/**
 * PUT /api/periode/:id/activate
 * Mengaktifkan periode penilaian (ubah status DRAFT -> ACTIVE).
 */
export async function activatePeriode(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string);
    const periode = await prisma.periodePenilaian.update({
      where: { id_periode: id },
      data: { status: "ACTIVE" },
    });
    res.json({ success: true, message: "Periode diaktifkan.", data: periode });
  } catch (error) {
    console.error("ActivatePeriode error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}

/**
 * PUT /api/periode/:id/close
 * Menutup periode penilaian (ubah status -> CLOSED).
 */
export async function closePeriode(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string);
    const periode = await prisma.periodePenilaian.update({
      where: { id_periode: id },
      data: { status: "CLOSED" },
    });
    res.json({ success: true, message: "Periode ditutup.", data: periode });
  } catch (error) {
    console.error("ClosePeriode error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}
