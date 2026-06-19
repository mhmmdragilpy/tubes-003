"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, UserCheck, FileText,
  ClipboardList, LogOut, ChevronLeft, ChevronRight, Shield
} from "lucide-react";

interface UserData {
  id_user: number;
  nama: string;
  email: string;
  role: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  // Role-based menu
  const roleKey = user?.role || "KARYAWAN";
  
  const menuItems: Record<string, { name: string; icon: any; path: string }[]> = {
    ADMIN_HR: [
      { name: "Monitoring Progress", icon: LayoutDashboard, path: "/dashboard/admin" },
      { name: "Kelola Periode", icon: ClipboardList, path: "/dashboard/admin/periode" },
      { name: "Daftar Karyawan", icon: Users, path: "/dashboard/admin/karyawan" },
      { name: "Laporan", icon: FileText, path: "/dashboard/admin/laporan" },
    ],
    MANAJEMEN: [
      { name: "Executive Dashboard", icon: LayoutDashboard, path: "/dashboard/manajemen" },
      { name: "Talent Mapping", icon: Users, path: "/dashboard/manajemen/talent" },
      { name: "Laporan Strategis", icon: FileText, path: "/dashboard/manajemen/laporan" },
    ],
    KARYAWAN: [
      { name: "Personal Dashboard", icon: LayoutDashboard, path: "/dashboard/karyawan" },
      { name: "Isi Penilaian 360°", icon: ClipboardList, path: "/dashboard/penilaian" },
    ],
    ATASAN: [
      { name: "Dashboard Tim", icon: LayoutDashboard, path: "/dashboard/atasan" },
      { name: "Approve Peer", icon: UserCheck, path: "/dashboard/atasan/peer" },
      { name: "Penilaian Bawahan", icon: ClipboardList, path: "/dashboard/penilaian" },
    ],
  };

  const currentMenu = menuItems[roleKey] || menuItems.KARYAWAN;

  const roleLabel: Record<string, string> = {
    ADMIN_HR: "Admin HR",
    MANAJEMEN: "Manajemen",
    ATASAN: "Atasan",
    KARYAWAN: "Karyawan",
  };

  const roleColor: Record<string, string> = {
    ADMIN_HR: "from-rose-500 to-pink-500",
    MANAJEMEN: "from-violet-500 to-purple-500",
    ATASAN: "from-amber-500 to-orange-500",
    KARYAWAN: "from-brand-500 to-teal-400",
  };

  const initials = user?.nama
    ? user.nama.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "??";

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-72"
      } h-full bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 relative z-30`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-300 transition-colors shadow-sm z-50"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      <div>
        {/* Logo */}
        <div className={`p-6 border-b border-slate-100 ${collapsed ? "px-4" : ""}`}>
          {collapsed ? (
            <div className="w-10 h-10 mx-auto rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-brand-700 tracking-tight">
                AKHLAK 360°
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-[0.15em]">
                PT Energi Nusantara
              </p>
            </>
          )}
        </div>

        {/* User Info Card */}
        {!collapsed && user && (
          <div className="mx-4 mt-6 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm`}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user.nama}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{roleLabel[roleKey]}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className={`mt-6 space-y-1 ${collapsed ? "px-2" : "px-3"}`}>
          {!collapsed && (
            <div className="px-3 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Menu Utama</span>
            </div>
          )}
          {currentMenu.map((item, idx) => {
            const isActive = pathname === item.path;
            return (
              <Link key={idx} href={item.path}>
                <div
                  className={`flex items-center ${collapsed ? "justify-center" : ""} gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                    isActive
                      ? "bg-brand-50 text-brand-700 font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500"}`} />
                  {!collapsed && <span className="text-sm">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className={`p-4 border-t border-slate-100 ${collapsed ? "px-2" : ""}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? "justify-center" : ""} gap-3 w-full px-3 py-2.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
          {!collapsed && <span className="font-semibold text-sm">Keluar Sistem</span>}
        </button>
      </div>
    </div>
  );
}
