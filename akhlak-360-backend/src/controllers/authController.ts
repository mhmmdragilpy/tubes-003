import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/database";

const JWT_SECRET = process.env.JWT_SECRET || "akhlak360-super-secret-key-2026";
const JWT_EXPIRES_IN = "24h";

/**
 * POST /api/auth/login
 * Login user dengan email & password, mengembalikan JWT token.
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ success: false, message: "Email atau password salah." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Email atau password salah." });
      return;
    }

    if (user.status !== "ACTIVE") {
      res.status(403).json({ success: false, message: "Akun Anda tidak aktif. Hubungi Admin HR." });
      return;
    }

    const token = jwt.sign(
      { id_user: user.id_user, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: "Login berhasil.",
      data: {
        token,
        user: {
          id_user: user.id_user,
          nama: user.nama,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}

/**
 * GET /api/auth/me
 * Mengembalikan data profil user yang sedang login berdasarkan JWT token.
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Tidak terautentikasi." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id_user: req.user.id_user },
      select: {
        id_user: true,
        nama: true,
        email: true,
        role: true,
        status: true,
        karyawan: { select: { nip: true, jabatan: true, departemen: true } },
        atasan: { select: { nip: true, jabatan: true } },
        adminHR: { select: { nip: true, jabatan: true } },
        manajemen: { select: { jabatan: true } },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User tidak ditemukan." });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("GetProfile error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}

/**
 * POST /api/auth/register (Admin only - untuk seeding / manajemen user)
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password || !role) {
      res.status(400).json({ success: false, message: "Semua field wajib diisi." });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ success: false, message: "Email sudah terdaftar." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role,
        status: "ACTIVE",
      },
    });

    res.status(201).json({
      success: true,
      message: "User berhasil didaftarkan.",
      data: { id_user: user.id_user, nama: user.nama, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}
