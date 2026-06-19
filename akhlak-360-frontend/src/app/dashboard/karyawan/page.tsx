"use client";

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from "recharts";
import { ClipboardList, TrendingUp, TrendingDown, Award } from "lucide-react";
import Link from "next/link";

const personalRadar = [
  { subject: "Amanah", self: 4.0, others: 4.5, fullMark: 5 },
  { subject: "Kompeten", self: 3.8, others: 4.2, fullMark: 5 },
  { subject: "Harmonis", self: 4.5, others: 4.0, fullMark: 5 },
  { subject: "Loyal", self: 4.7, others: 4.3, fullMark: 5 },
  { subject: "Adaptif", self: 3.5, others: 4.1, fullMark: 5 },
  { subject: "Kolaboratif", self: 4.2, others: 4.6, fullMark: 5 },
];

const gapAnalysis = [
  { name: "Amanah", gap: -0.5 },
  { name: "Kompeten", gap: -0.4 },
  { name: "Harmonis", gap: 0.5 },
  { name: "Loyal", gap: 0.4 },
  { name: "Adaptif", gap: -0.6 },
  { name: "Kolaboratif", gap: -0.4 },
];

const tugasPenilaian = [
  { id: 1, target: "Budi Hartono", tipe: "Peer", status: "Belum", deadline: "25 Jun 2026" },
  { id: 2, target: "Dewi Anggraini", tipe: "Peer", status: "Belum", deadline: "25 Jun 2026" },
  { id: 3, target: "Diri Sendiri", tipe: "Self", status: "Selesai", deadline: "20 Jun 2026" },
  { id: 4, target: "Ahmad Fauzi (Atasan)", tipe: "Atasan", status: "Proses", deadline: "25 Jun 2026" },
];

export default function KaryawanDashboard() {
  const nilaiAkhir = 4.15;
  const predikat = "Baik";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Personal Dashboard</h1>
        <p className="text-slate-500 mt-1">Selamat datang, Rizky Pratama — Semester 1 2026</p>
      </div>

      {/* Personal KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-5 border-t-4 border-t-brand-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Nilai Akhir</p>
            <Award className="w-5 h-5 text-brand-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{nilaiAkhir}</h3>
          <p className="text-xs text-brand-600 font-semibold mt-1">Predikat: {predikat}</p>
        </div>
        <div className="card p-5 border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Dimensi Terkuat</p>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-emerald-600 mt-2">Loyal</h3>
          <p className="text-xs text-slate-400 mt-1">Skor Self: 4.7</p>
        </div>
        <div className="card p-5 border-t-4 border-t-amber-400">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Perlu Ditingkatkan</p>
            <TrendingDown className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-amber-600 mt-2">Adaptif</h3>
          <p className="text-xs text-slate-400 mt-1">Gap: -0.6 dari penilaian orang lain</p>
        </div>
        <div className="card p-5 border-t-4 border-t-teal-400">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tugas Tersisa</p>
            <ClipboardList className="w-5 h-5 text-teal-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">2</h3>
          <p className="text-xs text-red-500 font-semibold mt-1">Deadline: 25 Jun 2026</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Radar - Self vs Others */}
        <div className="card p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Profil AKHLAK Saya</h2>
          <p className="text-xs text-slate-400 mb-4">Perbandingan Penilaian Diri vs. Orang Lain</p>
          <div className="flex-1 min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={personalRadar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8' }} />
                <Radar name="Penilaian Orang Lain" dataKey="others" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Radar name="Penilaian Diri" dataKey="self" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gap Analysis Bar Chart */}
        <div className="card p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Gap Analysis (Self − Others)</h2>
          <p className="text-xs text-slate-400 mb-4">Positif = overestimate diri, Negatif = underestimate diri (Blind Spot)</p>
          <div className="flex-1 min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapAnalysis} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[-1, 1]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="gap" radius={[0, 6, 6, 0]} barSize={20}>
                  {gapAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.gap >= 0 ? "#14b8a6" : "#f59e0b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tugas Penilaian */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Tugas Penilaian Saya</h2>
          <p className="text-xs text-slate-400 mt-1">Form yang harus diisi pada periode penilaian aktif</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Target Penilaian</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tugasPenilaian.map((t) => (
                <tr key={t.id} className="hover:bg-brand-50/30 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">{t.target}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      t.tipe === "Self" ? "bg-purple-100 text-purple-700 border-purple-200" :
                      t.tipe === "Peer" ? "bg-sky-100 text-sky-700 border-sky-200" :
                      "bg-indigo-100 text-indigo-700 border-indigo-200"
                    }`}>{t.tipe}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{t.deadline}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      t.status === "Selesai" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                      t.status === "Proses" ? "bg-amber-100 text-amber-700 border-amber-200" :
                      "bg-red-100 text-red-600 border-red-200"
                    }`}>{t.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {t.status !== "Selesai" ? (
                      <Link href="/dashboard/penilaian">
                        <button className="px-4 py-2 bg-gradient-to-r from-brand-500 to-teal-400 text-white rounded-lg text-xs font-semibold hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                          {t.status === "Proses" ? "Lanjutkan" : "Mulai Isi"}
                        </button>
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">✓ Terkirim</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
