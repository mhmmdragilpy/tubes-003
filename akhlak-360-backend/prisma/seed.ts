import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import process from "process";

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses seeding database komprehensif...");

  // Hapus data lama untuk clean state
  await prisma.jawabanPenilaian.deleteMany();
  await prisma.formPenilaian.deleteMany();
  await prisma.daftarPeer.deleteMany();
  await prisma.karyawan.deleteMany();
  await prisma.atasan.deleteMany();
  await prisma.adminHR.deleteMany();
  await prisma.manajemen.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 12);

  // ==========================================
  // 1. Buat Akun ADMIN HR
  // ==========================================
  const adminUser = await prisma.user.create({
    data: {
      nama: "Sarah Admin",
      email: "admin@energinusantara.com",
      password: passwordHash,
      role: "ADMIN_HR",
      status: "ACTIVE",
      adminHR: {
        create: { nip: "EN-ADM-001", jabatan: "Head of HR" },
      },
    },
  });
  console.log("✅ User ADMIN_HR dibuat: admin@energinusantara.com");

  // ==========================================
  // 2. Buat Akun MANAJEMEN (BOD)
  // ==========================================
  const manajemenUser = await prisma.user.create({
    data: {
      nama: "Budi Santoso",
      email: "manajemen@energinusantara.com",
      password: passwordHash,
      role: "MANAJEMEN",
      status: "ACTIVE",
      manajemen: {
        create: { jabatan: "Direktur Utama" },
      },
    },
  });
  console.log("✅ User MANAJEMEN dibuat: manajemen@energinusantara.com");

  // ==========================================
  // 3. Buat Akun ATASAN
  // ==========================================
  const atasanUser = await prisma.user.create({
    data: {
      nama: "Ahmad Fauzi",
      email: "atasan@energinusantara.com",
      password: passwordHash,
      role: "ATASAN",
      status: "ACTIVE",
      atasan: {
        create: { nip: "EN-SPV-001", jabatan: "Supervisor Operasional" },
      },
    },
  });
  console.log("✅ User ATASAN dibuat: atasan@energinusantara.com");

  // Mendapatkan id atasan untuk di-assign ke karyawan
  const atasanData = await prisma.atasan.findUnique({ where: { id_user: atasanUser.id_user } });

  // ==========================================
  // 4. Buat Akun KARYAWAN 1
  // ==========================================
  const karyawan1User = await prisma.user.create({
    data: {
      nama: "Rizky Pratama",
      email: "karyawan1@energinusantara.com",
      password: passwordHash,
      role: "KARYAWAN",
      status: "ACTIVE",
      karyawan: {
        create: {
          nip: "EN-KAR-001",
          jabatan: "Staff Developer",
          departemen: "IT",
          ...(atasanData && { id_atasan: atasanData.id_atasan }),
        },
      },
    },
  });
  console.log("✅ User KARYAWAN 1 dibuat: karyawan1@energinusantara.com");

  // ==========================================
  // 5. Buat Akun KARYAWAN 2
  // ==========================================
  const karyawan2User = await prisma.user.create({
    data: {
      nama: "Siti Rahmawati",
      email: "karyawan2@energinusantara.com",
      password: passwordHash,
      role: "KARYAWAN",
      status: "ACTIVE",
      karyawan: {
        create: {
          nip: "EN-KAR-002",
          jabatan: "Staff Analis",
          departemen: "IT",
          ...(atasanData && { id_atasan: atasanData.id_atasan }),
        },
      },
    },
  });
  console.log("✅ User KARYAWAN 2 dibuat: karyawan2@energinusantara.com");

  // ==========================================
  // 6. Buat Daftar Peer (Rekan Sejawat)
  // ==========================================
  const kar1Data = await prisma.karyawan.findUnique({ where: { id_user: karyawan1User.id_user } });
  const kar2Data = await prisma.karyawan.findUnique({ where: { id_user: karyawan2User.id_user } });

  if (kar1Data && kar2Data) {
    // Karyawan 2 menilai Karyawan 1
    await prisma.daftarPeer.create({
      data: {
        id_karyawan: kar1Data.id_karyawan,
        id_karyawan_peer: kar2Data.id_karyawan,
        status: "APPROVED", // Sudah di-approve oleh atasan
      },
    });
    console.log("✅ Relasi Peer dibuat: Karyawan 2 menilai Karyawan 1");
  }

  // ==========================================
  // 7. Buat Indikator AKHLAK Lengkap
  // ==========================================
  const indikatorData = [
    { dimensi: "AMANAH", name_indikator: "Memenuhi janji", deskripsi: "Memenuhi janji dan komitmen sesuai dengan tugas.", bobot: 0.166 },
    { dimensi: "AMANAH", name_indikator: "Bertanggungjawab", deskripsi: "Bertanggungjawab atas tugas, keputusan dan tindakan.", bobot: 0.166 },
    { dimensi: "KOMPETEN", name_indikator: "Belajar berkelanjutan", deskripsi: "Meningkatkan kompetensi diri untuk menjawab tantangan.", bobot: 0.166 },
    { dimensi: "KOMPETEN", name_indikator: "Membantu orang lain", deskripsi: "Membantu orang lain belajar dan mengembangkan kemampuan.", bobot: 0.166 },
    { dimensi: "HARMONIS", name_indikator: "Menghargai perbedaan", deskripsi: "Menghargai setiap orang apapun latar belakangnya.", bobot: 0.166 },
    { dimensi: "LOYAL", name_indikator: "Menjaga nama baik", deskripsi: "Menjaga nama baik sesama karyawan, pimpinan, BUMN, dan Negara.", bobot: 0.166 },
    { dimensi: "ADAPTIF", name_indikator: "Cepat menyesuaikan diri", deskripsi: "Cepat menyesuaikan diri untuk menjadi lebih baik.", bobot: 0.166 },
    { dimensi: "KOLABORATIF", name_indikator: "Sinergi", deskripsi: "Terbuka dalam bekerja sama untuk menghasilkan nilai tambah.", bobot: 0.166 },
  ];

  for (const ind of indikatorData) {
    const exist = await prisma.indikatorAkhlak.findFirst({
      where: { name_indikator: ind.name_indikator },
    });
    
    if (!exist) {
      await prisma.indikatorAkhlak.create({
        data: {
          dimensi: ind.dimensi as any,
          name_indikator: ind.name_indikator,
          deskripsi: ind.deskripsi,
          bobot: ind.bobot,
        },
      });
    }
  }
  console.log("✅ 8 Indikator AKHLAK berhasil diinjeksi!");

  console.log("🎉 Seeding Selesai! Semua password default adalah: password123");
}

main()
  .catch((e) => {
    console.error("Terjadi error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
