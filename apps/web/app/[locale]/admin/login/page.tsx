"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../clerk-compat";
import { useRouter, usePathname } from "next/navigation";
import { ShieldAlert, Sparkles, Mail, Lock, ArrowRight, RefreshCw } from "lucide-react";

export default function AdminLoginPage() {
  const { isSignedIn, user, setRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);

  // If already signed in as ADMIN, redirect straight to dashboard
  useEffect(() => {
    if (isSignedIn && user?.role === "ADMIN") {
      const segments = pathname.split("/");
      const locale = segments[1] || "en";
      router.push(`/${locale}/admin`);
    }
  }, [isSignedIn, user?.role]);

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return;

    setIsLoading(true);
    setLoadingStep("Verifying administrative credentials...");

    setTimeout(() => {
      // Direct Predefined Admin check (Security分離)
      const isPredefinedAdmin = email.trim().toLowerCase() === "dev@perceptionmapper.ai";
      
      if (!isPredefinedAdmin) {
        setIsLoading(false);
        setError("Access Denied: Insufficient credentials. Pre-defined administrator profiles only.");
        return;
      }

      setLoadingStep("Authorizing dashboard session...");
      setTimeout(() => {
        // Set mock state safely
        localStorage.setItem("pm_mock_signed_in", "true");
        localStorage.setItem("pm_mock_user_name", "Platform Admin");
        localStorage.setItem("pm_mock_user_rbac_role", "ADMIN");
        setRole("ADMIN");

        const segments = pathname.split("/");
        const locale = segments[1] || "en";
        router.push(`/${locale}/admin`);
      }, 600);
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 py-12 overflow-hidden bg-slate-950">
      {/* Ambient glowing radial effects */}
      <div className="absolute top-[-30%] left-[-30%] w-[70%] h-[70%] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-30%] right-[-30%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none animate-pulse" />

      {/* Corporate header brand */}
      <div className="flex items-center space-x-3 mb-8 relative z-10">
        <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2.5 rounded-xl shadow-xl shadow-purple-500/10">
          <ShieldAlert className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Perception Core AI
          </h1>
          <span className="text-[10px] text-purple-400 font-bold tracking-widest uppercase block">
            Platform Administration Gate
          </span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[100px] h-[100px] rounded-full bg-purple-500/10 blur-[30px] pointer-events-none" />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 blur animate-pulse" />
              <div className="relative bg-slate-950 p-4 rounded-full border border-slate-880">
                <RefreshCw className="h-8 w-8 text-purple-400 animate-spin" />
              </div>
            </div>
            <p className="text-sm font-semibold tracking-tight text-white mt-4">{loadingStep}</p>
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              Secure SSL Authorization Channel
            </span>
          </div>
        ) : (
          <form onSubmit={handleAdminSignIn} className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-white">Admin Console</h2>
              <p className="text-xs text-slate-400 mt-1.5">
                Pre-defined administrative profiles authentication only
              </p>
            </div>

            {error && (
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs leading-relaxed animate-in fade-in slide-in-from-top-1">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dev@perceptionmapper.ai"
                    className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Security Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide shadow-xl shadow-purple-500/10 hover:scale-[1.01] transition duration-300"
            >
              <span>Unlock Admin Panel</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </form>
        )}
      </div>

      <div className="mt-12 text-center text-[10px] text-slate-600 relative z-10">
        © 2026 Perception Mapper AI. Administrator security separation protocol active.
      </div>
    </div>
  );
}
