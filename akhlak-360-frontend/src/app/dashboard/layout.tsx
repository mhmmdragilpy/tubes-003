"use client";

import { Sidebar } from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

interface UserData {
  id_user: number;
  nama: string;
  email: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const roleLabel: Record<string, string> = {
    ADMIN_HR: "Admin HR",
    MANAJEMEN: "Manajemen",
    ATASAN: "Atasan",
    KARYAWAN: "Karyawan",
  };

  const initials = user?.nama
    ? user.nama.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "??";

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <div className="z-20 flex h-full shadow-md">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col z-10 overflow-hidden">
        <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Portal Penilaian 360</p>
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user?.nama || "Memuat..."}</p>
                <p className="text-xs font-bold text-brand-600 uppercase tracking-wider">{user ? roleLabel[user.role] : ""}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold">
                {initials}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
