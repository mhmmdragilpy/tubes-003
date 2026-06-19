"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();

  const testAccounts = [
    { role: "ADMIN_HR", label: "👑 Admin HR", email: "admin@energinusantara.com", password: "password123" },
    { role: "MANAJEMEN", label: "👔 Manajemen", email: "manajemen@energinusantara.com", password: "password123" },
    { role: "ATASAN", label: "🕵️ Atasan", email: "atasan@energinusantara.com", password: "password123" },
    { role: "KARYAWAN", label: "🧑‍💻 Karyawan 1", email: "karyawan1@energinusantara.com", password: "password123" },
    { role: "KARYAWAN2", label: "👩‍💻 Karyawan 2", email: "karyawan2@energinusantara.com", password: "password123" },
  ];

  const handleQuickSelect = (account: typeof testAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setSelectedRole(account.role);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { token, user } = data.data;
        
        // Simpan token & user di localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect sesuai Role
        if (user.role === "ADMIN_HR") {
          router.push("/dashboard/admin");
        } else if (user.role === "MANAJEMEN") {
          router.push("/dashboard/manajemen");
        } else if (user.role === "ATASAN") {
          router.push("/dashboard/atasan");
        } else {
          router.push("/dashboard/karyawan");
        }
      } else {
        alert(data.message || "Terjadi kesalahan saat login");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error.message || "Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">PT Energi Nusantara</h2>
          <p className="text-brand-200 font-medium tracking-wider text-sm uppercase">Portal Evaluasi Kinerja Internal</p>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-bold leading-tight mb-6">AKHLAK 360°</h1>
          <p className="text-lg text-brand-100 max-w-md">
            Sistem penilaian kinerja 360 derajat terpadu untuk mengevaluasi core values Amanah, Kompeten, Harmonis, Loyal, Adaptif, dan Kolaboratif.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-700 rounded-full opacity-50"></div>
        <div className="absolute top-1/4 -right-12 w-64 h-64 bg-teal-600 rounded-full opacity-30"></div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Masuk ke Akun</h2>
            <p className="text-slate-500 mt-2 text-sm">Gunakan NIP atau Email korporat Anda</p>
          </div>

          {/* Quick Select Role for Testing */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Pilih Akun Testing (Dev Mode)</label>
            <div className="flex flex-wrap gap-2">
              {testAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleQuickSelect(account)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${
                    selectedRole === account.role
                      ? "bg-brand-50 border-brand-200 text-brand-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
                Email / NIP
              </label>
              <input
                id="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors sm:text-sm"
                placeholder="Masukkan email atau NIP"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 font-medium">
                  Ingat Saya
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                  Lupa Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Memproses..." : "Masuk ke Portal"}
            </button>
          </form>
          
          <div className="mt-12 text-center lg:text-left">
            <p className="text-xs text-slate-400 font-medium">
              © 2026 Hak Cipta Dilindungi.<br className="lg:hidden"/> Internal Use Only - PT Energi Nusantara.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
