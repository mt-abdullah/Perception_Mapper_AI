"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { UserPlus, RefreshCw, Mail, Lock, User } from "lucide-react";
import Preloader from "../../components/Preloader";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import GoogleButton from "../../components/auth/GoogleButton";
import GitHubButton from "../../components/auth/GitHubButton";

export default function SignUpPage() {
  const { isSignedIn, signInUser, mounted } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const nextErrors: typeof errors = {};
    if (!name || name.trim().length < 3) {
      nextErrors.name = "Name must span at least 3 characters.";
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = "Please specify a valid email address.";
    }
    if (!password || password.length < 6) {
      nextErrors.password = "Password must span at least 6 characters.";
    }
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      signInUser(email.trim().toLowerCase(), name.trim());
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
    <AuthCard title="Create Account" description="Deploy a modern NLP mapping node and setup workspace access.">
      <form onSubmit={handleSignUp} className="space-y-4">
        <AuthInput
          label="Full Name"
          id="name-field"
          type="text"
          icon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Astraea Vance"
          error={errors.name}
          required
        />

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

        <AuthInput
          label="Confirm Password"
          id="confirm-password-field"
          type="password"
          icon={Lock}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          error={errors.confirmPassword}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold border border-indigo-400/20 shadow-md transition flex items-center justify-center disabled:opacity-50 select-none uppercase tracking-wider font-sans"
        >
          {loading ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" />
              <span>Generating Core Nodes...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-3.5 w-3.5 mr-2" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <div className="relative my-4 flex items-center justify-center">
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

      <div className="mt-5 text-center text-[10px] text-slate-400 font-semibold">
        Already registered?{" "}
        <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 hover:underline transition">
          Sign In here
        </Link>
      </div>
    </AuthCard>
  );
}

export const dynamic = "force-dynamic";
