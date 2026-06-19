import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "akhlak360-super-secret-key-2026";

export interface AuthPayload {
  id_user: number;
  email: string;
  role: string;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Middleware: Verifikasi token JWT dari header Authorization.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Token tidak ditemukan. Silakan login." });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ success: false, message: "Token tidak valid." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token kedaluwarsa atau tidak valid." });
    return;
  }
}

/**
 * Middleware Factory: Membatasi akses berdasarkan Role (RBAC).
 * Usage: roleGuard("ADMIN_HR", "MANAJEMEN")
 */
export function roleGuard(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Tidak terautentikasi." });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "Anda tidak memiliki akses ke resource ini." });
      return;
    }
    next();
  };
}
