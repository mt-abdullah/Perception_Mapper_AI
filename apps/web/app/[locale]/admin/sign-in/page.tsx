"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../clerk-compat";
import { useRouter, usePathname } from "next/navigation";
import { ShieldAlert, Sparkles, Mail, Lock, ArrowRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSignInPage() {
  const { isSignedIn, user, setRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Extract locale prefix
  const segments = pathname.split("/");
  const locale = segments[1] || "en";

  // If already signed in as ADMIN, redirect straight to dashboard
  useEffect(() => {
    const signedIn = localStorage.getItem("pm_mock_signed_in") === "true";
    const storedRole = localStorage.getItem("pm_mock_user_rbac_role");
    const isAdminSession = localStorage.getItem("pm_mock_admin_session") === "true";

    if (signedIn && storedRole === "ADMIN" && isAdminSession) {
      router.replace(`/${locale}/admin/dashboard`);
    }
  }, [isSignedIn, user, router, locale]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return;

    setIsLoading(true);
    setLoadingStep("Connecting secure administration gateway...");

    try {
      // Validate via Next.js backend API /api/admin/auth
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setIsLoading(false);
        setError(data.error || "Invalid admin credentials");
        return;
      }

      setLoadingStep("Authorizing workspace session token...");
      
      setTimeout(() => {
        // Store session parameters securely in local storage for front-end sync
        localStorage.setItem("pm_mock_signed_in", "true");
        localStorage.setItem("pm_mock_user_id", "mock-admin-id-" + Math.random().toString(36).substring(2, 9));
        localStorage.setItem("pm_mock_user_email", data.user.email);
        localStorage.setItem("pm_mock_user_rbac_role", "ADMIN");
        localStorage.setItem("pm_mock_user_name", data.user.name);
        localStorage.setItem("pm_mock_admin_session", "true");
        
        setRole("ADMIN");
        setIsLoading(false);

        // Redirect immediately to administration dashboard
        router.push(`/${locale}/admin/dashboard`);

        setTimeout(() => {
          window.location.reload();
        }, 150);
      }, 700);
    } catch (err) {
      setIsLoading(false);
      setError("Secure gateway connection timed out.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 py-12 overflow-hidden bg-slate-950 font-sans">
      
      {/* Ambient background glows */}
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-25%] w-[80%] h-[80%] rounded-full bg-pink-500/5 blur-[150px] pointer-events-none" />

      {/* Futuristic scanner overlay */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      {/* Corporate header brand */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center space-x-3 mb-8 relative z-10 select-none"
      >
        <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2.5 rounded-xl border border-purple-500/20 shadow-lg shadow-purple-500/20">
          <ShieldAlert className="h-5 w-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight leading-none mb-1">
            PERCEPTION CORE AI
          </h1>
          <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block">
            Platform Administration Gate
          </span>
        </div>
      </motion.div>

      {/* Centered Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-slate-950/50"
      >
        {/* Glow edge highlight */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 blur animate-pulse opacity-30" />
              <div className="relative bg-slate-950 p-4 rounded-full border border-slate-900">
                <RefreshCw className="h-8 w-8 text-purple-400 animate-spin" />
              </div>
            </div>
            <p className="text-xs font-bold tracking-tight text-white mt-4">{loadingStep}</p>
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase block">
              Secure SSL Authorization Active
            </span>
          </div>
        ) : (
          <form onSubmit={handleAdminSignIn} className="space-y-5 text-left">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold tracking-wide text-white">Admin Console</h2>
              <p className="text-xs text-slate-400 mt-1">
                Authorized platform accounts credentials verify gateway only.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center space-x-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin1@perception.ai"
                    className="w-full bg-slate-950/80 border border-slate-850 focus:border-purple-500 focus:outline-none rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 transition duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Security Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-850 focus:border-purple-500 focus:outline-none rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 transition duration-300"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-650 to-pink-650 hover:from-purple-500 hover:to-pink-550 text-white rounded-xl text-xs font-bold border border-purple-400/20 shadow-lg shadow-purple-650/15 transition duration-300 flex items-center justify-center select-none"
            >
              <span>Unlock Admin Panel</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </motion.button>
          </form>
        )}
      </motion.div>

      {/* Simple absolute footer */}
      <div className="mt-12 text-center text-[10px] text-slate-600 relative z-10 select-none">
        © 2026 Perception Mapper AI. Platform Administrator separation active.
      </div>
    </div>
  );
}
