"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Zap, ShieldCheck, Flame, Home, Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface LayoutProps { children: React.ReactNode; theme: "free" | "basic" | "pro"; activePage: "free" | "basic" | "pro" }

export default function DashboardLayout({ children, theme, activePage }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const themeStyles = {
    free: { border: "border-slate-800", bg: "bg-slate-950/20", active: "text-slate-200 bg-slate-900 border-slate-700", hover: "hover:bg-slate-900/40 text-slate-500 hover:text-slate-300", accent: "text-slate-400" },
    basic: { border: "border-blue-900/30", bg: "bg-blue-950/5", active: "text-blue-400 bg-blue-950/40 border-blue-900/40", hover: "hover:bg-blue-950/20 text-slate-500 hover:text-blue-300", accent: "text-blue-400" },
    pro: { border: "border-purple-900/30", bg: "bg-purple-950/5", active: "text-purple-400 bg-purple-950/40 border-purple-900/40", hover: "hover:bg-purple-950/20 text-slate-500 hover:text-purple-300", accent: "text-amber-400" }
  }[theme];

  const sidebarLinks = [
    { name: "Free Dashboard", href: "/dashboard/free", id: "free", icon: Zap },
    { name: "Basic Dashboard", href: "/dashboard/basic", id: "basic", icon: Flame },
    { name: "Pro Dashboard", href: "/dashboard/pro", id: "pro", icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-slate-955 text-slate-100 flex font-sans select-none relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-20%] w-[70%] h-[70%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 border-r ${themeStyles.border} bg-slate-950/60 backdrop-blur-xl relative z-20`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-900/60">
          <Link href="/dashboard" className="text-white font-extrabold text-xs tracking-widest uppercase hover:text-indigo-400 transition">
            Perception Panel
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-300 hover:bg-slate-900/30 transition">
            <Home className="h-4 w-4" />
            <span>Main Home Portal</span>
          </Link>
          <div className="h-[1px] bg-slate-900/60 my-4" />
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isSelected = activePage === link.id;
            return (
              <Link key={link.id} href={link.href} className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl border text-xs font-bold transition duration-300 ${isSelected ? themeStyles.active : themeStyles.hover}`}>
                <Icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        {/* Topbar Layout */}
        <header className={`h-16 border-b ${themeStyles.border} bg-slate-950/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0`}>
          <div className="flex items-center space-x-3">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900/50 transition">
              <Menu className="h-4 w-4" />
            </button>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard Console</span>
              <span className="text-slate-700">/</span>
              <span className={themeStyles.accent}>{theme} Mode</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-[10px] font-bold text-slate-400 uppercase bg-slate-950/40 border border-slate-900 px-3 py-1.5 rounded-lg">
              User: <span className={themeStyles.accent}>{user?.name || "Guest User"}</span>
            </span>
            <Link href="/dashboard" className="px-3.5 py-1.5 border border-slate-900 bg-slate-950/20 text-slate-400 hover:text-white text-[10px] font-bold rounded-lg transition uppercase tracking-wider">
              Portal Home
            </Link>
          </div>
        </header>

        {/* Page children contents */}
        <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 py-10 space-y-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar overlay drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-955/60 backdrop-blur-sm">
          <div className="w-64 bg-slate-950 border-r border-slate-900 p-5 flex flex-col justify-between">
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-white tracking-widest">Perception Suite</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg"><X className="h-4 w-4" /></button>
              </div>
              <nav className="space-y-2">
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-900/30">
                  <Home className="h-4 w-4" />
                  <span>Main Home Portal</span>
                </Link>
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isSelected = activePage === link.id;
                  return (
                    <Link key={link.id} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl border text-xs font-bold transition ${isSelected ? themeStyles.active : themeStyles.hover}`}>
                      <Icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
