"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { Key, RefreshCw, Mail, Lock } from "lucide-react";
import Preloader from "../../components/Preloader";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import GoogleButton from "../../components/auth/GoogleButton";
import GitHubButton from "../../components/auth/GitHubButton";

export default function SignInPage() {
  const { isSignedIn, signInUser, signInAdmin, mounted } = useAuth();
  const [email, setEmail] = useState("user@perception.ai");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const nextErrors: typeof errors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = "Please specify a valid email address.";
    }
    if (!password || password.length < 6) {
      nextErrors.password = "Password must span at least 6 characters.";
    }
    
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const isAdmin = cleanEmail.startsWith("admin");

      if (isAdmin) {
        const check = signInAdmin(cleanEmail, password);
        if (!check.success) {
          setErrors({ general: check.error || "Invalid credentials." });
          setLoading(false);
        }
      } else {
        signInUser(cleanEmail);
      }
    }, 700);
  };

  const handleOAuth = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      signInUser(`oauth-${provider.toLowerCase()}@perception.ai`, `${provider} User`);
    }, 600);
  };

  if (!mounted || isSignedIn) {
    return <Preloader message="CONNECTING TO SECURE AUTH GATEWAY..." />;
  }

  return (
    <AuthCard title="Welcome Back" description="Sign in to resume secure NLP node visualization and custom mappings.">
      <form onSubmit={handleSignIn} className="space-y-4">
        {errors.general && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/20 text-rose-450 rounded-xl font-semibold text-xs text-center">
            {errors.general}
          </div>
        )}

        <AuthInput
          label="Email Address"
          id="email-field"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@perception.ai"
          error={errors.email}
          required
        />

        <div className="space-y-1">
          <AuthInput
            label="Password"
            id="password-field"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            required
          />
          <div className="text-right">
            <Link href="#" className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition">
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold border border-indigo-400/20 shadow-md transition flex items-center justify-center disabled:opacity-50 select-none uppercase tracking-wider font-sans"
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

      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800/80"></div>
        </div>
        <span className="relative bg-[#090d16] px-3.5 text-[9px] font-extrabold uppercase tracking-widest text-slate-500 select-none">
          or continue with
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <GoogleButton onClick={() => handleOAuth("Google")} disabled={loading} />
        <GitHubButton onClick={() => handleOAuth("GitHub")} disabled={loading} />
      </div>

      <div className="mt-6 text-center text-[10px] text-slate-400 font-semibold">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 hover:underline transition">
          Sign Up here
        </Link>
      </div>
    </AuthCard>
  );
}

export const dynamic = "force-dynamic";
