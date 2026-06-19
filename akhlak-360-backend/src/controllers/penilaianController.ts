import { Request, Response } from "express";
import prisma from "../config/database";

/**
 * GET /api/penilaian/form/:periodeId
 * Mendapatkan daftar form penilaian milik user yang sedang login pada periode tertentu.
 */
export async function getMyForms(req: Request, res: Response): Promise<void> {
  try {
    const periodeId = parseInt(req.params.periodeId as string);
    const userId = req.user!.id_user;

    const forms = await prisma.formPenilaian.findMany({
      where: { id_periode: periodeId, id_penilai: userId },
      include: {
        karyawan: {
          include: { user: { select: { nama: true } } },
        },
      },
      orderBy: { id_form: "asc" },
    });

    res.json({ success: true, data: forms });
  } catch (error) {
    console.error("GetMyForms error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}

/**
 * GET /api/penilaian/form/detail/:formId
 * Mendapatkan detail lengkap formulir beserta jawabannya (jika sudah diisi).
 */
export async function getFormDetail(req: Request, res: Response): Promise<void> {
  try {
    const formId = parseInt(req.params.formId as string);

    const form = await prisma.formPenilaian.findUnique({
      where: { id_form: formId },
      include: {
        karyawan: { include: { user: { select: { nama: true } } } },
        penilai: { select: { nama: true } },
        jawabans: {
          include: { indikator: true },
          orderBy: { id_indikator: "asc" },
        },
      },
    });

    if (!form) {
      res.status(404).json({ success: false, message: "Form tidak ditemukan." });
      return;
    }

    // Ambil semua indikator untuk ditampilkan (jika belum ada jawaban)
    const semuaIndikator = await prisma.indikatorAkhlak.findMany({ orderBy: { id_indikator: "asc" } });

    res.json({ success: true, data: { ...form, semuaIndikator } });
  } catch (error) {
    console.error("GetFormDetail error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}

/**
 * POST /api/penilaian/submit/:formId
 * Submit jawaban penilaian untuk sebuah form.
 * Body: { jawaban: [{ id_indikator: number, skor: number, komentar?: string }] }
 */
export async function submitPenilaian(req: Request, res: Response): Promise<void> {
  try {
    const formId = parseInt(req.params.formId as string);
    const { jawaban } = req.body;

    if (!jawaban || !Array.isArray(jawaban) || jawaban.length === 0) {
      res.status(400).json({ success: false, message: "Data jawaban wajib diisi." });
      return;
    }

    // Verifikasi bahwa form milik user yang login
    const form = await prisma.formPenilaian.findUnique({ where: { id_form: formId } });
    if (!form) {
      res.status(404).json({ success: false, message: "Form tidak ditemukan." });
      return;
    }
    if (form.id_penilai !== req.user!.id_user) {
      res.status(403).json({ success: false, message: "Anda tidak berhak mengisi form ini." });
      return;
    }
    if (form.status === "SUBMITTED") {
      res.status(400).json({ success: false, message: "Form sudah pernah di-submit." });
      return;
    }

    // Hapus jawaban lama (jika ada draft) lalu buat baru
    await prisma.jawabanPenilaian.deleteMany({ where: { id_form: formId } });

    // Simpan jawaban baru
    await prisma.jawabanPenilaian.createMany({
      data: jawaban.map((j: { id_indikator: number; skor: number; komentar?: string }) => ({
        id_form: formId,
        id_indikator: j.id_indikator,
        skor: j.skor,
        komentar: j.komentar || null,
      })),
    });

    // Update status form
    await prisma.formPenilaian.update({
      where: { id_form: formId },
      data: { status: "SUBMITTED", tgl_submit: new Date() },
    });

    res.json({ success: true, message: "Penilaian berhasil disimpan." });
  } catch (error) {
    console.error("SubmitPenilaian error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}

/**
 * GET /api/penilaian/hasil/:karyawanId/:periodeId
 * Mendapatkan hasil penilaian (agregasi) seorang karyawan pada periode tertentu.
 */
export async function getHasilPenilaian(req: Request, res: Response): Promise<void> {
  try {
    const karyawanId = parseInt(req.params.karyawanId as string);
    const periodeId = parseInt(req.params.periodeId as string);

    // Ambil semua form yang menilai karyawan ini di periode tersebut
    const forms = await prisma.formPenilaian.findMany({
      where: {
        id_karyawan: karyawanId,
        id_periode: periodeId,
        status: "SUBMITTED",
      },
      include: { jawabans: { include: { indikator: true } } },
    });

    // Hitung rata-rata per tipe penilaian
    const bobotMap: Record<string, number> = {
      ATASAN: 0.4,
      BAWAHAN: 0.3,
      PEER: 0.2,
      SELF: 0.1,
    };

    const nilaiPerTipe: Record<string, number[]> = {};

    for (const form of forms) {
      const tipe = form.tipe_penilaian;
      const avgSkor = form.jawabans.reduce((sum, j) => sum + j.skor, 0) / (form.jawabans.length || 1);
      if (!nilaiPerTipe[tipe]) nilaiPerTipe[tipe] = [];
      nilaiPerTipe[tipe].push(avgSkor);
    }

    let nilaiAkhir = 0;
    for (const [tipe, skorList] of Object.entries(nilaiPerTipe)) {
      const avgTipe = skorList.reduce((a, b) => a + b, 0) / skorList.length;
      const bobot = bobotMap[tipe] || 0;
      nilaiAkhir += avgTipe * bobot;
    }

    // Tentukan predikat
    let predikat = "Kurang";
    if (nilaiAkhir >= 4.5) predikat = "Sangat Baik";
    else if (nilaiAkhir >= 3.5) predikat = "Baik";
    else if (nilaiAkhir >= 2.5) predikat = "Cukup";

    res.json({
      success: true,
      data: {
        karyawanId,
        periodeId,
        nilaiPerTipe: Object.fromEntries(
          Object.entries(nilaiPerTipe).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length])
        ),
        nilaiAkhir: parseFloat(nilaiAkhir.toFixed(2)),
        predikat,
      },
    });
  } catch (error) {
    console.error("GetHasilPenilaian error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}
