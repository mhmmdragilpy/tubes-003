"use client";

import { useState } from "react";
import { Search, Filter, Download, ChevronDown, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const karyawanData = [
  { id: 1, nip: "EN-2024001", nama: "Ahmad Fauzi", departemen: "Operasional", jabatan: "Supervisor", self: "Selesai", atasan: "Selesai", peer: "Proses", bawahan: "Belum", progress: 65 },
  { id: 2, nip: "EN-2024002", nama: "Siti Rahmawati", departemen: "Keuangan", jabatan: "Analis", self: "Selesai", atasan: "Selesai", peer: "Selesai", bawahan: "Selesai", progress: 100 },
  { id: 3, nip: "EN-2024003", nama: "Rizky Pratama", departemen: "IT", jabatan: "Developer", self: "Selesai", atasan: "Proses", peer: "Belum", bawahan: "-", progress: 35 },
  { id: 4, nip: "EN-2024004", nama: "Dewi Anggraini", departemen: "HR", jabatan: "Staff", self: "Belum", atasan: "Belum", peer: "Belum", bawahan: "-", progress: 0 },
  { id: 5, nip: "EN-2024005", nama: "Budi Hartono", departemen: "Operasional", jabatan: "Manager", self: "Selesai", atasan: "Selesai", peer: "Selesai", bawahan: "Proses", progress: 85 },
  { id: 6, nip: "EN-2024006", nama: "Ratna Sari", departemen: "Marketing", jabatan: "Staff", self: "Selesai", atasan: "Selesai", peer: "Proses", bawahan: "-", progress: 55 },
  { id: 7, nip: "EN-2024007", nama: "Hendri Wijaya", departemen: "Keuangan", jabatan: "Manager", self: "Selesai", atasan: "Selesai", peer: "Selesai", bawahan: "Selesai", progress: 100 },
  { id: 8, nip: "EN-2024008", nama: "Mega Putri", departemen: "HR", jabatan: "Staff", self: "Proses", atasan: "Belum", peer: "Belum", bawahan: "-", progress: 15 },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Selesai": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Proses": "bg-amber-100 text-amber-700 border-amber-200",
    "Belum": "bg-red-100 text-red-600 border-red-200",
    "-": "bg-slate-100 text-slate-400 border-slate-200",
  };
  const icons: Record<string, React.ReactNode> = {
    "Selesai": <CheckCircle2 className="w-3 h-3" />,
    "Proses": <Clock className="w-3 h-3" />,
    "Belum": <AlertCircle className="w-3 h-3" />,
    "-": null,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles["-"]}`}>
      {icons[status]}
      {status}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  let color = "bg-red-400";
  if (value >= 80) color = "bg-emerald-500";
  else if (value >= 40) color = "bg-amber-400";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-600 w-10 text-right">{value}%</span>
    </div>
  );
}

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("Semua");

  const filteredData = karyawanData.filter((k) => {
    const matchSearch = k.nama.toLowerCase().includes(search.toLowerCase()) || k.nip.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "Semua" || k.departemen === filterDept;
    return matchSearch && matchDept;
  });

  const totalSelesai = karyawanData.filter(k => k.progress === 100).length;
  const totalProses = karyawanData.filter(k => k.progress > 0 && k.progress < 100).length;
  const totalBelum = karyawanData.filter(k => k.progress === 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Monitoring Progress Penilaian</h1>
        <p className="text-slate-500 mt-1">Periode: Semester 1 2026 — Status Pengisian Formulir 360°</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-5 border-l-4 border-l-brand-500">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Karyawan</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{karyawanData.length}</h3>
        </div>
        <div className="card p-5 border-l-4 border-l-emerald-500">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Selesai</p>
          <h3 className="text-3xl font-bold text-emerald-600 mt-1">{totalSelesai}</h3>
        </div>
        <div className="card p-5 border-l-4 border-l-amber-400">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Sedang Proses</p>
          <h3 className="text-3xl font-bold text-amber-500 mt-1">{totalProses}</h3>
        </div>
        <div className="card p-5 border-l-4 border-l-red-400">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Belum Mengisi</p>
          <h3 className="text-3xl font-bold text-red-500 mt-1">{totalBelum}</h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau NIP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition appearance-none cursor-pointer"
            >
              <option>Semua</option>
              <option>Operasional</option>
              <option>Keuangan</option>
              <option>IT</option>
              <option>HR</option>
              <option>Marketing</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-teal-400 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
          <Download className="w-4 h-4" />
          Ekspor Data
        </button>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">NIP</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Departemen</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Self</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Atasan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Peer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Bawahan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-40">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((k) => (
                <tr key={k.id} className="hover:bg-brand-50/30 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">{k.nip}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">{k.nama}</p>
                    <p className="text-xs text-slate-400">{k.jabatan}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{k.departemen}</td>
                  <td className="px-6 py-4"><StatusBadge status={k.self} /></td>
                  <td className="px-6 py-4"><StatusBadge status={k.atasan} /></td>
                  <td className="px-6 py-4"><StatusBadge status={k.peer} /></td>
                  <td className="px-6 py-4"><StatusBadge status={k.bawahan} /></td>
                  <td className="px-6 py-4"><ProgressBar value={k.progress} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 text-sm text-slate-500 flex justify-between items-center">
          <span>Menampilkan {filteredData.length} dari {karyawanData.length} karyawan</span>
          <span className="text-xs text-slate-400">Data terakhir diperbarui: 18 Jun 2026, 21:00 WIB</span>
        </div>
      </div>
    </div>
  );
}
