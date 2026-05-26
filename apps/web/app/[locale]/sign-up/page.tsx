"use client";

import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { Sparkles, UserPlus, RefreshCw } from "lucide-react";
import Preloader from "../../../components/Preloader";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignUpPage() {
  const { isSignedIn, signInUser, mounted } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      signInUser(email.trim().toLowerCase(), name.trim() || "Standard User");
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
          <h2 className="text-lg font-bold tracking-wide text-white">Supernova Sign Up</h2>
          <p className="text-xs text-slate-400 leading-normal max-w-xs mx-auto">
            Establish modular node keys to register your secure profile.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5 text-left text-xs">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-slate-200"
              placeholder="Astraea Vance"
              required
            />
          </div>

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
              className="w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2.5 text-slate-200"
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
                <span>Generating Nodes...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-3.5 w-3.5 mr-2" />
                <span>Sign Up to Workspace</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-[10px] text-slate-450 font-semibold leading-normal">
          Already registered?{" "}
          <Link href={`/${locale}/sign-in`} className="text-indigo-400 hover:text-indigo-305 hover:underline transition">
            Sign In here
          </Link>
        </div>
      </div>
      <div className="mt-12 text-center text-[10px] text-slate-600 relative z-10">
        © 2026 Perception Mapper AI. Encrypted verification gateways.
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
