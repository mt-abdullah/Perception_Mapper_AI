"use client";

import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Sparkles, Key, RefreshCw } from "lucide-react";
import Preloader from "../../components/Preloader";

export default function SignInPage() {
  const { isSignedIn, signInUser, signInAdmin, mounted } = useAuth();
  const [email, setEmail] = useState("user@perception.ai");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const isAdmin = cleanEmail.startsWith("admin");

      if (isAdmin) {
        const check = signInAdmin(cleanEmail, password);
        if (!check.success) {
          setError(check.error || "Invalid administrator credentials.");
          setLoading(false);
        }
      } else {
        signInUser(cleanEmail);
      }
    }, 700);
  };

  if (!mounted || isSignedIn) {
    return <Preloader message="CONNECTING TO SECURE AUTH GATEWAY..." />;
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 py-12 overflow-hidden bg-slate-955 font-sans">
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-25%] w-[80%] h-[80%] rounded-full bg-pink-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="flex items-center space-x-3 mb-8 relative z-10 select-none">
        <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-xl border border-indigo-400/20 shadow-lg">
          <Sparkles className="h-5 w-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
            PERCEPTION MAPPER AI
          </h1>
          <span className="text-[9px] text-indigo-400 font-extrabold tracking-widest uppercase block">NLP Security Gate</span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        <div className="space-y-2 text-center mb-6">
          <h2 className="text-lg font-bold tracking-wide text-white">Perception Sign In</h2>
          <p className="text-xs text-slate-400 leading-normal max-w-xs mx-auto">
            Provide workspace credentials to deploy core node handshakes.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5 text-left text-xs">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/20 text-rose-400 rounded-xl font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-slate-200"
              placeholder="user@perception.ai"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-955/80 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-slate-200"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold border border-indigo-400/20 shadow-lg transition flex items-center justify-center disabled:opacity-50 select-none font-sans uppercase tracking-wider"
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
          </button>
        </form>
      </div>
      <div className="mt-12 text-center text-[10px] text-slate-600 relative z-10">
        © 2026 Perception Mapper AI. Encrypted verification gateways.
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
