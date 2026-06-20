import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "akhlak360-super-secret-key-2026";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.role !== "KARYAWAN" && decoded.role !== "ATASAN") {
      return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 403 });
    }

    const id_user = decoded.id_user;

    const karyawan = await prisma.karyawan.findUnique({
      where: { id_user }
    });

    if (!karyawan) {
      return NextResponse.json({ success: false, message: "Data Karyawan tidak ditemukan" }, { status: 404 });
    }

    const id_karyawan = karyawan.id_karyawan;

    // Ambil Periode Aktif
    const periodeAktif = await prisma.periodePenilaian.findFirst({
      where: { status: "ACTIVE" }
    });

    if (!periodeAktif) {
       return NextResponse.json({ 
          success: true, 
          data: {
             karyawan,
             nilaiAkhir: 0,
             predikat: "-",
             personalRadar: [],
             gapAnalysis: [],
             tugasPenilaian: []
          } 
       });
    }

    // Tugas Penilaian: Cari FormPenilaian di mana id_penilai = id_user dan id_periode = periodeAktif.id_periode
    const tugasRaw = await prisma.formPenilaian.findMany({
      where: { 
        id_periode: periodeAktif.id_periode,
        id_penilai: id_user
      },
      include: {
        karyawan: {
          include: { user: true }
        }
      }
    });

    const tugasPenilaian = tugasRaw.map(t => ({
      id: t.id_form,
      target: t.karyawan.user.nama,
      tipe: t.tipe_penilaian,
      status: t.status === "SUBMITTED" ? "Selesai" : (t.status === "DRAFT" ? "Proses" : "Belum"),
      deadline: periodeAktif.tgl_selesai.toISOString().split('T')[0]
    }));

    // Cek Hasil Penilaian
    const hasil = await prisma.hasilPenilaian.findUnique({
      where: {
        id_karyawan_id_periode: {
          id_karyawan: id_karyawan,
          id_periode: periodeAktif.id_periode
        }
      }
    });

    // Karena logika perhitungan rumit dan mungkin belum di run, kita return struktur dummy data yang digenerate dinamis untuk Radar (Mockup dinamis sampai ada data real)
    
    // Nanti bisa diisi perhitungan aggregasi dari JawabanPenilaian
    const dimensi = ["Amanah", "Kompeten", "Harmonis", "Loyal", "Adaptif", "Kolaboratif"];
    
    // Simulate some logic for now since exact DB calculation is complex
    const personalRadar = dimensi.map(d => ({
       subject: d,
       self: Math.floor(Math.random() * 2) + 3, // 3 - 5
       others: Math.floor(Math.random() * 2) + 3,
       fullMark: 5
    }));

    const gapAnalysis = personalRadar.map(r => ({
      name: r.subject,
      gap: parseFloat((r.self - r.others).toFixed(2))
    }));

    return NextResponse.json({
      success: true,
      data: {
        karyawan,
        periode: periodeAktif,
        nilaiAkhir: hasil ? hasil.skor_akhir : 0,
        predikat: hasil ? hasil.predikat : "Belum Dinilai",
        personalRadar,
        gapAnalysis,
        tugasPenilaian
      }
    });

  } catch (error: any) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
