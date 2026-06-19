# Dokumen Inisiasi Proyek & Analisis Mendalam
**Project Name:** Perancangan Sistem Penilaian Kinerja 360° Berbasis Web untuk Evaluasi Core Values AKHLAK pada PT Energi Nusantara

---

## 1. Analisis Mendalam (Berdasarkan Laporan, Use Case, dan ERD)

### 1.1. Analisis Bisnis dan Fungsional (Laporan)
Sistem ini bertujuan mendigitalisasi proses penilaian kinerja perilaku berdasarkan *Core Values* AKHLAK (Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif) pada PT Energi Nusantara. Sistem ini beralih dari penggunaan *spreadsheet* manual ke aplikasi berbasis web guna meminimalisir kesalahan, meningkatkan efisiensi waktu, dan menyediakan pemantauan *real-time*.

Proses penilaian menggunakan metode **360 derajat** yang melibatkan banyak pihak sebagai penilai untuk mendapatkan hasil yang lebih komprehensif, dengan struktur pembobotan:
- **Atasan Langsung:** 40%
- **Bawahan:** 30%
- **Rekan Sejawat (Peer):** 20%
- **Self-assessment (Diri Sendiri):** 10%

**Kriteria Kesuksesan (Acceptance Criteria):**
- Sinkronisasi data HRIS 100%.
- Perhitungan kalkulasi otomatis harus akurat berdasarkan rumus pembobotan di atas.
- *Dashboard* dapat menampilkan analitik dan *gap analysis* (Self vs Others) secara *real-time*.
- Rekam jejak (*history*) tidak dapat dimanipulasi untuk referensi jangka panjang (*talent management*).

### 1.2. Analisis Use Case (Peran & Hak Akses)
Berdasarkan dokumen laporan dan gambar Use Case Diagram, terdapat 4 *Actor* utama dalam sistem ini:

1. **Admin HR (Pusat Kendali Operasional):**
   - Mengatur periode penilaian (tanggal mulai dan batas akhir).
   - Menentukan dan mengelola *Daftar Peer* (rekan sejawat yang akan menilai).
   - Melakukan monitoring *progress* (siapa yang sudah, sedang proses, dan belum mengisi).
   - *Logout* dan mengamankan sesi.
2. **Atasan Langsung (Validasi & Evaluator Utama):**
   - Menyetujui atau menolak (*Approve/Reject*) daftar *peer* bawahan yang diajukan oleh Admin HR.
   - Mengisi penilaian *Self Assessment* untuk diri sendiri.
   - Mengisi penilaian *Bawahan* terhadap staf di bawahnya.
   - Melihat laporan/dashboard tim.
3. **Karyawan (Objek dan Subjek Penilaian):**
   - Mengisi penilaian untuk diri sendiri (*Self Assessment*).
   - Mengisi penilaian untuk Atasan atau *Peer* (sesuai penugasan).
   - Melihat *Personal Dashboard* (termasuk *gap analysis* diri sendiri).
4. **Manajemen (Pembuat Keputusan Strategis):**
   - Menggunakan sistem murni untuk memantau hasil akhir pada *Executive Dashboard*.
   - Menganalisis dan menentukan keputusan berdasarkan hasil penilaian. Pembagian target tindak lanjut: 60% untuk *Individual Development Plan* (IDP) dan 40% untuk pemetaan talenta (*talent mapping*).

### 1.3. Analisis Entity Relationship Diagram (ERD) & Struktur Database
Berdasarkan gambar ERD, arsitektur basis data relasional dirancang sangat terstruktur dan mendukung auditabilitas (history data). Terdapat tabel-tabel krusial:

- **Manajemen Pengguna (Users, Admin_HR, Atasan, Karyawan, Manajemen):** 
  Sistem menggunakan tabel `User` terpusat untuk autentikasi yang kemudian berelasi (One-to-One) dengan tabel detail *role* masing-masing (Admin, Atasan, Karyawan, Manajemen) menggunakan `id_user` sebagai *Foreign Key*.
- **Konfigurasi Penilaian (Periode_Penilaian, Indikator_AKHLAK):** 
  Tabel `Periode_Penilaian` menjaga histori pelaksanaan dari waktu ke waktu. Tabel `Indikator_AKHLAK` menyimpan rincian pertanyaan per dimensi (Amanah, Kompeten, dll.) beserta bobotnya.
- **Transaksi Penilaian (Daftar_Peer, Form_Penilaian, Jawaban_Penilaian):** 
  - `Daftar_Peer`: Mengunci siapa menilai siapa dan status persetujuannya dari Atasan.
  - `Form_Penilaian`: Merepresentasikan satu set formulir untuk satu kombinasi penilai dan yang dinilai, dengan atribut `status` dan `tgl_submit`.
  - `Jawaban_Penilaian`: Relasi *One-to-Many* dari formulir untuk menyimpan skor (1-5) dari masing-masing indikator.
- **Analitik & Pelaporan (Hasil_Penilaian, Dashboard, Laporan):** 
  Digunakan untuk agregasi nilai akhir, penentuan predikat, dan pembuatan *report* siap unduh.

---

## 2. Pemilihan Modern Tech Stack (Arsitektur Solusi)

Sesuai permintaan Anda, kita akan mentransformasi solusi (yang awalnya direncanakan menggunakan *stack* konvensional) menjadi tumpukan teknologi web modern (JAMStack / MERN-like).

| Lapisan / Kategori | Teknologi Utama | Alasan Pemilihan & Kelebihan |
| --- | --- | --- |
| **Frontend** | **Next.js (App Router)** | Rendering super cepat (SSR & SSG), *routing* dinamis, SEO *friendly*, sangat optimal untuk *dashboard* dengan banyak manipulasi data. |
| **Styling & UI** | **Tailwind CSS + Shadcn UI** | Desain yang sangat cepat (*utility-first*), dapat membuat UI korporat (BUMN) yang bersih, profesional, namun modern dan *responsive*. |
| **Backend API** | **Express.js (Node.js)** | Ringan, memiliki ekosistem luar biasa luas, mudah diskalakan. Kita akan membuat arsitektur *RESTful API* atau *GraphQL*. |
| **Database** | **PostgreSQL** | Standar industri untuk relational database skala *enterprise*. Sangat tangguh menjaga integritas data kompleks seperti skema Penilaian 360°. |
| **ORM (Object Relational Mapping)**| **Prisma** | Menulis skema *database* lebih intuitif, *type-safe* sepenuhnya berkat integrasi TypeScript. Proses sinkronisasi antara ERD ke tabel *database* sangat mudah. |
| **State Management**| **Zustand / React Query** | React Query untuk otomatisasi *caching* data dashboard, Zustand untuk *client state* (seperti *wizard* saat mengisi form). |

---

## 3. Rencana Inisiasi Proyek (Project Setup)

Berikut adalah panduan lengkap inisiasi proyek (struktur *monorepo* atau repositori terpisah).

### 3.1. Prasyarat (Prerequisites)
Pastikan telah menginstal:
- Node.js (Minimal v18.x)
- PostgreSQL (Minimal v14.x)
- Git

### 3.2. Setup Backend (Express.js + Prisma)
Buka terminal dan jalankan urutan ini untuk menginisiasi *backend*:

```bash
# 1. Buat folder backend
mkdir akhlak-360-backend
cd akhlak-360-backend

# 2. Inisiasi project Node
npm init -y

# 3. Install framework & package utama
npm install express cors dotenv jsonwebtoken bcryptjs
npm install -D typescript @types/node @types/express ts-node nodemon

# 4. Inisiasi TypeScript
npx tsc --init

# 5. Inisiasi Prisma ORM
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```
Setelah `prisma init`, file `prisma/schema.prisma` akan terbuat. ERD yang ada di gambar di atas akan langsung diterjemahkan ke dalam blok `model` di Prisma (contoh untuk *User* dan *Indikator*):

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id_user  Int      @id @default(autoincrement())
  nama     String
  email    String   @unique
  password String
  role     String   // ADMIN_HR, ATASAN, KARYAWAN, MANAJEMEN
  status   String   // ACTIVE, INACTIVE
  
  // Relasi
  karyawan Karyawan?
  atasan   Atasan?
}

model Indikator_AKHLAK {
  id_indikator   Int      @id @default(autoincrement())
  dimensi        String   // AMANAH, KOMPETEN, dll
  name_indikator String
  deskripsi      String
  bobot          Float
}
// Dan seterusnya untuk seluruh tabel di ERD...
```

### 3.3. Setup Frontend (Next.js + TailwindCSS)
Kembali ke root directory, lalu inisiasi folder frontend:

```bash
# 1. Inisiasi Next.js dengan Tailwind secara otomatis
npx create-next-app@latest akhlak-360-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd akhlak-360-frontend

# 2. Install library pendukung untuk chart dan form validation
npm install recharts react-hook-form @hookform/resolvers zod axios

# 3. (Opsional) Install library UI modern Shadcn UI
npx shadcn-ui@latest init
```

### 3.4. Rencana Struktur Folder Akhir

```text
/akhlak-360-project
│
├── /akhlak-360-backend      (Express, Prisma, PostgreSQL)
│   ├── /prisma
│   │   └── schema.prisma    <-- Implementasi ERD ada di sini
│   ├── /src
│   │   ├── /controllers
│   │   ├── /routes
│   │   ├── /middleware      <-- Validasi JWT Role-based
│   │   └── index.ts
│   └── .env
│
└── /akhlak-360-frontend     (Next.js App Router, Tailwind)
    ├── /src
    │   ├── /app
    │   │   ├── /(auth)      <-- Halaman Login
    │   │   ├── /admin       <-- Dashboard Admin HR
    │   │   ├── /karyawan    <-- Form & Personal Dashboard
    │   │   └── /manajemen   <-- Executive Dashboard
    │   ├── /components      <-- UI Reusable (Card, Button, dll)
    │   └── /services        <-- Axios API calls
    └── .env.local
```

### Kesimpulan Analisis
Dokumen telah menjelaskan skenario bisnis (As-Is ke To-Be) dengan sangat baik. Tantangan terbesarnya secara teknis adalah **Algoritma Agregasi Nilai** (40% atasan, 30% bawahan, dll.) yang harus dinamis terhadap ketidakhadiran nilai tertentu, serta **Manajemen Akses (Role-Based Access Control / RBAC)** yang kompleks (seorang karyawan bisa dinilai dan menilai, sekaligus menjadi atasan bagi orang lain). 

Dengan adopsi **Express + PostgreSQL + Prisma**, logika relasional yang dalam (seperti Atasan -> Bawahan -> Daftar Peer) dapat diselesaikan dengan fungsi relasi `include` dari Prisma yang sangat ringkas. Sementara di sisi tampilan, **Next.js** dipadukan dengan **TailwindCSS** akan menjamin performa render *Dashboard Analitik* yang memanjakan mata pihak Manajemen.
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system. For 
more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:2 char:1
+ npm run dev
+ ~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccessnpm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system. For 
more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:2 char:1
+ npm run dev
+ ~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess