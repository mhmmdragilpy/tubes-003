"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Send, Star, MessageSquare } from "lucide-react";

const dimensiAkhlak = [
  {
    nama: "Amanah",
    deskripsi: "Memegang teguh kepercayaan yang diberikan.",
    indikator: [
      { id: 1, teks: "Memenuhi janji dan komitmen sesuai dengan tugas dan tanggungjawab." },
      { id: 2, teks: "Bertanggungjawab atas tugas, keputusan dan tindakan yang dilakukan." },
      { id: 3, teks: "Berpegang teguh kepada nilai moral dan etika dalam setiap tindakan." },
    ],
  },
  {
    nama: "Kompeten",
    deskripsi: "Terus belajar dan mengembangkan kapabilitas.",
    indikator: [
      { id: 4, teks: "Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah." },
      { id: 5, teks: "Membantu orang lain belajar dan mengembangkan kemampuan." },
      { id: 6, teks: "Menyelesaikan tugas dengan kualitas terbaik." },
    ],
  },
  {
    nama: "Harmonis",
    deskripsi: "Saling peduli dan menghargai perbedaan.",
    indikator: [
      { id: 7, teks: "Menghargai setiap orang apapun latar belakangnya." },
      { id: 8, teks: "Suka menolong orang lain tanpa pamrih." },
      { id: 9, teks: "Membangun lingkungan kerja yang kondusif dan inklusif." },
    ],
  },
  {
    nama: "Loyal",
    deskripsi: "Berdedikasi dan mengutamakan kepentingan bangsa dan negara.",
    indikator: [
      { id: 10, teks: "Menjaga nama baik sesama karyawan, pimpinan, BUMN, dan Negara." },
      { id: 11, teks: "Rela berkorban untuk mencapai tujuan yang lebih besar." },
      { id: 12, teks: "Patuh kepada pimpinan sepanjang tidak bertentangan dengan hukum dan etika." },
    ],
  },
  {
    nama: "Adaptif",
    deskripsi: "Terus berinovasi dan antusias dalam menggerakkan maupun menghadapi perubahan.",
    indikator: [
      { id: 13, teks: "Cepat menyesuaikan diri untuk menjadi lebih baik dalam menghadapi perubahan." },
      { id: 14, teks: "Terus menerus melakukan perbaikan mengikuti perkembangan teknologi." },
      { id: 15, teks: "Bertindak proaktif terhadap peluang dan tantangan baru." },
    ],
  },
  {
    nama: "Kolaboratif",
    deskripsi: "Membangun kerjasama yang sinergis.",
    indikator: [
      { id: 16, teks: "Memberi kesempatan kepada berbagai pihak untuk berkontribusi." },
      { id: 17, teks: "Terbuka dalam bekerja sama untuk menghasilkan nilai tambah." },
      { id: 18, teks: "Menggerakkan pemanfaatan berbagai sumber daya untuk tujuan bersama." },
    ],
  },
];

const colorMap: Record<string, string> = {
  "Amanah": "from-blue-500 to-blue-700",
  "Kompeten": "from-emerald-500 to-emerald-700",
  "Harmonis": "from-pink-500 to-pink-700",
  "Loyal": "from-amber-500 to-amber-700",
  "Adaptif": "from-purple-500 to-purple-700",
  "Kolaboratif": "from-teal-500 to-teal-700",
};

export default function PenilaianFormPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [jawaban, setJawaban] = useState<Record<number, { skor: number; komentar: string }>>({});
  const [submitted, setSubmitted] = useState(false);

  const current = dimensiAkhlak[currentStep];
  const totalSteps = dimensiAkhlak.length;

  const handleSkor = (idIndikator: number, skor: number) => {
    setJawaban((prev) => ({
      ...prev,
      [idIndikator]: { ...prev[idIndikator], skor, komentar: prev[idIndikator]?.komentar || "" },
    }));
  };

  const handleKomentar = (idIndikator: number, komentar: string) => {
    setJawaban((prev) => ({
      ...prev,
      [idIndikator]: { ...prev[idIndikator], skor: prev[idIndikator]?.skor || 0, komentar },
    }));
  };

  const allCurrentFilled = current.indikator.every((ind) => jawaban[ind.id]?.skor > 0);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card p-12 text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-lg">
            <Send className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Penilaian Berhasil Dikirim!</h2>
          <p className="text-slate-500 text-sm">
            Terima kasih telah mengisi formulir penilaian 360° Core Values AKHLAK. Data Anda telah tersimpan dengan aman.
          </p>
          <a href="/dashboard/karyawan">
            <button className="mt-8 px-6 py-3 bg-gradient-to-r from-brand-500 to-teal-400 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
              Kembali ke Dashboard
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Formulir Penilaian 360°</h1>
        <p className="text-slate-500 mt-1">Menilai: <span className="font-semibold text-brand-600">Budi Hartono</span> — Tipe: <span className="font-semibold text-teal-600">Peer</span></p>
      </div>

      {/* Stepper Progress */}
      <div className="card p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          {dimensiAkhlak.map((d, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  idx < currentStep
                    ? "bg-emerald-500 text-white shadow-md"
                    : idx === currentStep
                    ? "bg-gradient-to-r from-brand-500 to-teal-400 text-white shadow-lg scale-110"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {idx < currentStep ? "✓" : idx + 1}
              </div>
              <span className={`text-[10px] mt-1.5 font-semibold tracking-tight ${idx === currentStep ? "text-brand-600" : "text-slate-400"}`}>{d.nama}</span>
            </div>
          ))}
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Dimensi Header Card */}
      <div className={`bg-gradient-to-r ${colorMap[current.nama]} rounded-2xl p-6 text-white shadow-lg`}>
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Dimensi {currentStep + 1} / {totalSteps}</p>
        <h2 className="text-2xl font-bold mt-1">{current.nama}</h2>
        <p className="text-sm mt-2 opacity-90">{current.deskripsi}</p>
      </div>

      {/* Indikator Cards */}
      <div className="space-y-5">
        {current.indikator.map((ind, idx) => (
          <div key={ind.id} className="card p-6 hover:shadow-lg transition-shadow duration-300">
            <p className="text-sm font-semibold text-slate-700 mb-4">
              <span className="text-brand-500 mr-2">{idx + 1}.</span>
              {ind.teks}
            </p>

            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-4">
              <span className="text-xs text-slate-400 mr-3 w-24">Skor (1-5):</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleSkor(ind.id, star)}
                  className="group transition-all duration-150"
                >
                  <Star
                    className={`w-8 h-8 transition-all duration-200 ${
                      star <= (jawaban[ind.id]?.skor || 0)
                        ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                        : "text-slate-300 group-hover:text-amber-300"
                    }`}
                  />
                </button>
              ))}
              {jawaban[ind.id]?.skor > 0 && (
                <span className="ml-3 text-lg font-bold text-amber-500">{jawaban[ind.id].skor}.0</span>
              )}
            </div>

            {/* Comment */}
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
              <textarea
                rows={2}
                placeholder="Tambahkan komentar kualitatif (opsional)..."
                value={jawaban[ind.id]?.komentar || ""}
                onChange={(e) => handleKomentar(ind.id, e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-none placeholder-slate-400"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-2 pb-8">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={() => setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1))}
            disabled={!allCurrentFilled}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-teal-400 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allCurrentFilled}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4" />
            Kirim Penilaian
          </button>
        )}
      </div>
    </div>
  );
}
