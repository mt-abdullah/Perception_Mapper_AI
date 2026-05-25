"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState, createContext } from "react";
import { useAuth } from "../../clerk-compat";
import { useRouter, usePathname } from "next/navigation";
import {
  ShieldAlert,
  Users,
  Sliders,
  Cpu,
  Lock,
  ArrowLeft,
  Settings,
  DollarSign,
  Activity,
  LogOut
} from "lucide-react";

export const AdminTabContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({
  activeTab: "dashboard",
  setActiveTab: () => {},
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, user, setRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoginPage = pathname.endsWith("/admin/login");

  // Client-side Router protection guard
  useEffect(() => {
    if (mounted && !isLoginPage) {
      if (!isSignedIn) {
        const segments = pathname.split("/");
        const locale = segments[1] || "en";
        router.push(`/${locale}/admin/login`);
      } else if (user?.role !== "ADMIN") {
        // Redirection block or let the forbidden UI handle it
        console.warn("Intrusion detected: Unauthorized non-admin user forced route navigation");
      }
    }
  }, [mounted, isSignedIn, user?.role, pathname, isLoginPage]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-mono text-xs">
        System authorization handshake...
      </div>
    );
  }

  // Bypass Layout for Login Gate
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 403 Forbidden Access block if signed in user is not admin
  if (isSignedIn && user?.role !== "ADMIN") {
    const handleReturnToDashboard = () => {
      const segments = pathname.split("/");
      const locale = segments[1] || "en";
      router.push(`/${locale}`);
    };

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-8 text-center overflow-hidden relative">
        <div className="absolute top-[-30%] left-[-30%] w-[60%] h-[60%] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 p-8 rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-2xl max-w-md w-full space-y-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-500">
            <Lock className="h-6 w-6 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white">403: Access Forbidden</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account credential profile does not possess administrative access privileges. All unauthorized forced route navigation attempts are logged by the security auditor.
            </p>
          </div>
          
          <button
            onClick={handleReturnToDashboard}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl py-3 text-xs font-semibold hover:border-slate-700 transition duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to User Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  // Secure Sidebar Admin Shell
  const handleSignOutAdmin = () => {
    // Revoke mock admin local storage token and navigate back
    localStorage.removeItem("pm_mock_signed_in");
    localStorage.removeItem("pm_mock_user_rbac_role");
    setRole("USER");
    
    const segments = pathname.split("/");
    const locale = segments[1] || "en";
    router.push(`/${locale}/admin/login`);
  };

  const handleReturnToUserDashboard = () => {
    const segments = pathname.split("/");
    const locale = segments[1] || "en";
    router.push(`/${locale}`);
  };

  return (
    <AdminTabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
        {/* 1. Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-900 bg-slate-950 flex-col shrink-0 relative overflow-hidden hidden md:flex">
          {/* Glow ambient */}
          <div className="absolute top-0 left-0 w-[120px] h-[120px] rounded-full bg-purple-500/5 blur-[40px] pointer-events-none" />

          {/* Brand details */}
          <div className="p-6 border-b border-slate-900/60 flex items-center space-x-3.5 z-10">
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-lg border border-purple-500/20 text-white shrink-0">
              <ShieldAlert className="h-4 w-4 shrink-0" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white leading-tight">Perception Admin</h1>
              <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">
                Control Panel v0.1
              </span>
            </div>
          </div>

          {/* Links lists */}
          <nav className="flex-1 p-4 space-y-1.5 z-10">
            <span className="block px-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
              Administration Tools
            </span>
            
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition duration-200 ${
                  activeTab === "dashboard"
                    ? "bg-slate-900/50 text-indigo-400 border border-slate-800/40 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                }`}
              >
                <Activity className="h-4 w-4 shrink-0" />
                <span>Dashboard Telemetry</span>
              </button>
              
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition duration-200 ${
                  activeTab === "users"
                    ? "bg-slate-900/50 text-indigo-400 border border-slate-800/40 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                }`}
              >
                <Users className="h-4 w-4 shrink-0" />
                <span>Users Manager</span>
              </button>

              <button
                onClick={() => setActiveTab("policies")}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition duration-200 ${
                  activeTab === "policies"
                    ? "bg-slate-900/50 text-indigo-400 border border-slate-800/40 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                }`}
              >
                <Sliders className="h-4 w-4 shrink-0" />
                <span>AI Engine Policies</span>
              </button>

              <button
                onClick={() => setActiveTab("logs")}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition duration-200 ${
                  activeTab === "logs"
                    ? "bg-slate-900/50 text-indigo-400 border border-slate-800/40 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                }`}
              >
                <Cpu className="h-4 w-4 shrink-0" />
                <span>Audit Logs Feed</span>
              </button>
            </div>
          </nav>

          {/* Admin profile & role backdoors */}
          <div className="p-4 border-t border-slate-900 bg-slate-950/40 space-y-3 z-10">
            {/* Quick toggle to user dashboard */}
            <button
              onClick={handleReturnToUserDashboard}
              className="w-full flex items-center justify-center space-x-2 py-2 border border-slate-850 bg-slate-900/20 text-slate-400 hover:text-slate-200 hover:border-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-wider transition"
            >
              <ArrowLeft className="h-3 w-3 shrink-0" />
              <span>Go to User App</span>
            </button>

            {/* Session details */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-900">
              <div className="flex items-center space-x-2.5 min-w-0">
                <img
                  src={user?.avatarUrl}
                  alt="Admin"
                  className="w-7 h-7 rounded-lg border border-purple-500/20 shrink-0"
                />
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold text-white truncate leading-tight">
                    {user?.name || "Admin"}
                  </span>
                  <span className="block text-[9px] text-purple-400 font-bold uppercase tracking-widest">
                    System Admin
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleSignOutAdmin}
                className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/10 rounded transition shrink-0"
                title="Terminate administrator session"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* 2. Main Admin Workbench Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
          {/* Glow ambient */}
          <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

          {/* Admin navbar header */}
          <header className="h-16 border-b border-slate-900/60 px-6 sm:px-8 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-white tracking-wide block md:hidden">
                🛡️ Admin Workbench
              </span>
              <span className="hidden md:inline-flex items-center text-[10px] font-semibold text-slate-500 uppercase tracking-widest select-none">
                {activeTab === "dashboard"
                  ? "Dashboard Telemetry Overview"
                  : activeTab === "users"
                  ? "Users Accounts Management"
                  : activeTab === "policies"
                  ? "Global AI Policies workbench"
                  : "Platform Security Audit Logs Feed"}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[9px] font-bold text-purple-400 bg-purple-950/40 border border-purple-500/20 rounded-md uppercase tracking-wider shrink-0 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>Firewall Active</span>
              </span>

              {/* Mobile Exit button */}
              <button
                onClick={handleReturnToUserDashboard}
                className="p-1.5 text-slate-400 hover:text-white md:hidden hover:bg-slate-900 rounded-lg transition"
                title="Return to User Dashboard"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Content canvas container */}
          <main className="flex-1 p-6 sm:p-8 z-10 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminTabContext.Provider>
  );
}
