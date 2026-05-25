"use client";

export const dynamic = "force-dynamic";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SignUp, useAuth } from "../../clerk-compat";
import { Sparkles } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (isSignedIn) {
      const segments = pathname.split('/');
      const locale = segments[1] || 'en';
      router.push(`/${locale}/dashboard`);
    }
  }, [isSignedIn, router, pathname]);
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 py-12 overflow-hidden bg-slate-950">
      {/* Ambient background glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-pink-500/10 blur-[130px] pointer-events-none" />

      {/* Brand logo header */}
      <div className="flex items-center space-x-3 mb-8 relative z-10">
        <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Perception Mapper AI
          </h1>
          <span className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase block">
            NLP Account Setup
          </span>
        </div>
      </div>

      {/* Auth centered component */}
      <div className="relative z-10 w-full flex justify-center">
        <SignUp />
      </div>

      {/* Simple absolute footer */}
      <div className="mt-12 text-center text-[10px] text-slate-600 relative z-10">
        © 2026 Perception Mapper AI. Encrypted verification gateways.
      </div>
    </div>
  );
}
