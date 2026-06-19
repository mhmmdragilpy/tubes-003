import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import periodeRoutes from "./routes/periodeRoutes";
import penilaianRoutes from "./routes/penilaianRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, message: "AKHLAK 360° API is running smoothly!" });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/periode", periodeRoutes);
app.use("/api/penilaian", penilaianRoutes);

// Error Handling Middleware (Global)
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Terjadi kesalahan internal pada server." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
