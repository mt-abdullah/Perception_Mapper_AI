"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../clerk-compat";
import { Sparkles, RefreshCw, Key, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignInPage() {
  const router = useRouter();
  const { isSignedIn, user } = useAuth();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract locale prefix
  const segments = pathname.split("/");
  const locale = segments[1] || "en";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Secure Route Protection Redirect: If already authenticated, redirect immediately
  useEffect(() => {
    if (mounted && isSignedIn && user) {
      if (user.role === "ADMIN") {
        router.replace(`/${locale}/admin`);
      } else {
        router.replace(`/${locale}/dashboard`);
      }
    }
  }, [mounted, isSignedIn, user, router, locale]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        let finalRole: "USER" | "ADMIN" = "USER";
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail === "admin@example.com" || cleanEmail === "admin@supernova.ai") {
          finalRole = "ADMIN";
        }
        
        localStorage.setItem("pm_mock_signed_in", "true");
        localStorage.setItem("pm_mock_user_id", "mock-user-id-" + Math.random().toString(36).substring(2, 9));
        localStorage.setItem("pm_mock_user_email", email);
        localStorage.setItem("pm_mock_user_rbac_role", finalRole);
        localStorage.setItem("pm_mock_user_name", finalRole === "ADMIN" ? "Platform Admin" : "Standard User");
        
        // Synchronized cookie check for next-intl / middleware alignment
        document.cookie = "pm_mock_signed_in=true; path=/";

        setLoading(false);

        // Standard user vs administrative redirects
        if (finalRole === "ADMIN") {
          router.push(`/${locale}/admin`);
        } else {
          router.push(`/${locale}/dashboard`);
        }

        // Force runtime state sync across layouts
        setTimeout(() => {
          window.location.reload();
        }, 150);
      } catch (err) {
        setError("Secure gateway authentication failed.");
        setLoading(false);
      }
    }, 850);
  };

  // Render a pre-mount preloader to resolve Next.js hydration mismatches
  if (!mounted || (isSignedIn && user)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center font-mono text-[10px] text-slate-500 select-none">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 blur opacity-30 animate-pulse" />
          <div className="relative bg-slate-950 border border-slate-900 rounded-xl px-6 py-4 flex items-center space-x-3">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            <span>ESTABLISHING SECURE GATEWAY...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 py-12 overflow-hidden bg-slate-950 font-sans">
      
      {/* Ambient background glows */}
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-25%] w-[80%] h-[80%] rounded-full bg-pink-500/5 blur-[150px] pointer-events-none" />

      {/* Futuristic scanner overlay */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      {/* Brand logo header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center space-x-3 mb-8 relative z-10 select-none"
      >
        <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-xl border border-indigo-400/20 shadow-lg shadow-indigo-500/20">
          <Sparkles className="h-5 w-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight leading-none mb-1">
            PERCEPTION MAPPER AI
          </h1>
          <span className="text-[9px] text-indigo-400 font-extrabold tracking-widest uppercase block">
            NLP Security Gate
          </span>
        </div>
      </motion.div>

      {/* Centered Glassmorphism Card Wrapper */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-slate-950/50"
      >
        {/* Glow edge highlight */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        <div className="space-y-2 text-center mb-6">
          <h2 className="text-lg font-bold tracking-wide text-white">Supernova Sign In</h2>
          <p className="text-xs text-slate-400 leading-normal max-w-xs mx-auto">
            Provide standard workspace credentials to deploy core node handshakes.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5 text-left">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center space-x-2">
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-slate-200 transition duration-300"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-[10px] text-indigo-400 font-semibold hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-slate-200 transition duration-300"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Primary CTA: "Sign In to Workspace" */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold border border-indigo-400/20 shadow-lg shadow-indigo-600/15 transition duration-300 flex items-center justify-center disabled:opacity-50 select-none"
          >
            {loading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" />
                <span>Establishing Handshake...</span>
              </>
            ) : (
              <>
                <Key className="h-3.5 w-3.5 mr-2" />
                <span>Sign In to Workspace</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Secondary CTA navigation */}
        <div className="mt-6 pt-5 border-t border-slate-800/60 text-center text-xs text-slate-400 select-none">
          <span>Don't have an account? </span>
          <Link href={`/${locale}/sign-up`} className="text-indigo-400 hover:underline font-bold transition">
            Sign Up
          </Link>
        </div>
      </motion.div>

      {/* Simple absolute footer */}
      <div className="mt-12 text-center text-[10px] text-slate-600 relative z-10 select-none">
        © 2026 Perception Mapper AI. Encrypted verification gateways.
      </div>
    </div>
  );
}
