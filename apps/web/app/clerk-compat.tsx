"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import * as RealClerk from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Mail, Lock, ArrowRight, Sparkles, RefreshCw } from "lucide-react";

const hasRealClerkKey =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder") &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_");

// Define a local mock context for dev mode
const MockClerkContext = createContext<{
  isSignedIn: boolean;
  setSignedIn: (val: boolean) => void;
  user: { name: string; avatarUrl: string; role: string; tier: string };
  setRole: (role: string) => void;
}>({
  isSignedIn: false,
  setSignedIn: () => {},
  user: { name: "Demo Developer", avatarUrl: "https://ui-avatars.com/api/?name=Demo+Developer", role: "ADMIN", tier: "PRO" },
  setRole: () => {},
});

export function ClerkProvider({ children, ...props }: any) {
  const [isSignedIn, setSignedIn] = useState(false);
  const [role, setRole] = useState("ADMIN");

  // Sync session state from localStorage in mock mode to persist logins across refreshes
  useEffect(() => {
    if (!hasRealClerkKey) {
      const stored = localStorage.getItem("pm_mock_signed_in");
      if (stored === "true") {
        setSignedIn(true);
      }
      const storedRole = localStorage.getItem("pm_mock_user_rbac_role") || "ADMIN";
      setRole(storedRole);
      if (!localStorage.getItem("pm_mock_user_rbac_role")) {
        localStorage.setItem("pm_mock_user_rbac_role", "ADMIN");
      }
    }
  }, []);

  const handleSetSignedIn = (val: boolean) => {
    setSignedIn(val);
    if (!hasRealClerkKey) {
      localStorage.setItem("pm_mock_signed_in", val ? "true" : "false");
    }
    // In mock mode we store a static user profile
    if (!hasRealClerkKey && val) {
      localStorage.setItem("pm_mock_user_name", "Demo Developer");
      localStorage.setItem("pm_mock_user_rbac_role", "ADMIN");
    }
  };

  const handleSetRole = (newRole: string) => {
    setRole(newRole);
    if (!hasRealClerkKey) {
      localStorage.setItem("pm_mock_user_rbac_role", newRole);
    }
  };

  if (hasRealClerkKey) {
    return <RealClerk.ClerkProvider {...props}>{children}</RealClerk.ClerkProvider>;
  }

  return (
    <MockClerkContext.Provider value={{
      isSignedIn,
      setSignedIn: handleSetSignedIn,
      user: {
        name: localStorage.getItem("pm_mock_user_name") || "Demo Developer",
        avatarUrl: "https://ui-avatars.com/api/?name=" + encodeURIComponent(localStorage.getItem("pm_mock_user_name") || "Demo Developer"),
        role: role,
        tier: "PRO",
      },
      setRole: handleSetRole,
    }}>
      {children}
    </MockClerkContext.Provider>
  );
}

export function SignedIn({ children }: { children: React.ReactNode }) {
  if (hasRealClerkKey) {
    return <RealClerk.SignedIn>{children}</RealClerk.SignedIn>;
  }
  const { isSignedIn } = useContext(MockClerkContext);
  return isSignedIn ? <>{children}</> : null;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  if (hasRealClerkKey) {
    return <RealClerk.SignedOut>{children}</RealClerk.SignedOut>;
  }
  const { isSignedIn } = useContext(MockClerkContext);
  return !isSignedIn ? <>{children}</> : null;
}

export function SignInButton({ children, mode }: any) {
  const router = useRouter();
  const pathname = usePathname();

  if (hasRealClerkKey) {
    return <RealClerk.SignInButton mode={mode}>{children}</RealClerk.SignInButton>;
  }

  const handleMockSignInClick = () => {
    const segments = pathname.split("/");
    const locale = segments[1] || "en";
    router.push(`/${locale}/sign-in`);
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick: handleMockSignInClick });
  }

  return (
    <button
      onClick={handleMockSignInClick}
      className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition duration-300 shadow shadow-indigo-500/10"
    >
      Sign In
    </button>
  );
}

export function UserButton(props: any) {
  const router = useRouter();
  const pathname = usePathname();

  if (hasRealClerkKey) {
    return <RealClerk.UserButton {...props} />;
  }

  const { setSignedIn } = useContext(MockClerkContext);
  const handleMockSignOut = () => {
    setSignedIn(false);
    const segments = pathname.split("/");
    const locale = segments[1] || "en";
    router.push(`/${locale}`);
  };

  return (
    <button
      onClick={handleMockSignOut}
      className="px-3 py-1.5 text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 rounded-xl hover:text-white hover:border-slate-700 transition"
    >
      Sign Out
    </button>
  );
}

export function useAuth(): any {
  if (hasRealClerkKey) {
    return { ...RealClerk.useAuth(), setRole: () => {} };
  }
  const { isSignedIn, user, setRole } = useContext(MockClerkContext);
  return {
    isSignedIn,
    userId: isSignedIn ? "user_mock_dev_2k98fhj3" : null,
    user,
    setRole,
  };
}

// ----------------- Mock Interactive Sign-In Component -----------------
export function SignIn(props: any) {
  if (hasRealClerkKey) {
    return <RealClerk.SignIn {...props} />;
  }

  const { setSignedIn } = useContext(MockClerkContext);
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setLoadingStep("Verifying secure credentials...");

    setTimeout(() => {
      setLoadingStep("Configuring local Clerk token session...");
      setTimeout(() => {
        setSignedIn(true);
        const segments = pathname.split("/");
        const locale = segments[1] || "en";
        router.push(`/${locale}`);
      }, 600);
    }, 600);
  };

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true);
    setLoadingStep(`Contacting mock ${provider} OAuth gateway...`);

    setTimeout(() => {
      setLoadingStep("Importing user avatar metadata...");
      setTimeout(() => {
        setSignedIn(true);
        const segments = pathname.split("/");
        const locale = segments[1] || "en";
        router.push(`/${locale}`);
      }, 600);
    }, 600);
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-indigo-500/10 blur-[40px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[120px] h-[120px] rounded-full bg-pink-500/10 blur-[40px] pointer-events-none" />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 blur animate-pulse" />
            <div className="relative bg-slate-950 p-4 rounded-full border border-slate-800">
              <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
            </div>
          </div>
          <p className="text-sm font-semibold tracking-tight text-white mt-4">
            {loadingStep}
          </p>
          <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            Clerk Sandbox Dev mode
          </span>
        </div>
      ) : (
        <form onSubmit={handleMockSubmit} className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-400 mt-1.5">
              Access your analytical workspaces securely
            </p>
          </div>

          {/* Social Sign-In */}
          <button
            type="button"
            onClick={() => handleOAuthLogin("Google")}
            className="w-full flex items-center justify-center space-x-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-200 hover:text-white transition duration-300"
          >
            {/* Custom Google SVG Icon */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.93 1 12 1 7.35 1 3.39 3.65 1.45 7.55l3.77 2.92C6.12 7.02 8.84 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.45 12.3c0-.82-.07-1.6-.21-2.3H12v4.4h6.43c-.28 1.44-1.1 2.67-2.33 3.5l3.6 2.8c2.1-1.94 3.75-4.8 3.75-8.4z"
              />
              <path
                fill="#FBBC05"
                d="M5.22 14.77a7.07 7.07 0 0 1 0-4.54L1.45 7.31a11.96 11.96 0 0 0 0 9.38l3.77-2.92z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.8c-1.1.74-2.52 1.18-4.36 1.18-3.16 0-5.88-1.98-6.83-5.43L1.4 16.03C3.34 19.9 7.3 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-900" />
            <span className="flex-shrink mx-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              Or credentials
            </span>
            <div className="flex-grow border-t border-slate-900" />
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
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
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
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
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.01] transition duration-300"
          >
            <span>Access Dashboard</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>

          {/* Links */}
          <p className="text-center text-[11px] text-slate-400">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => {
                const segments = pathname.split("/");
                const locale = segments[1] || "en";
                router.push(`/${locale}/sign-up`);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors"
            >
              Sign Up for Free
            </span>
          </p>
        </form>
      )}
    </div>
  );
}

// ----------------- Mock Interactive Sign-Up Component -----------------
export function SignUp(props: any) {
  if (hasRealClerkKey) {
    return <RealClerk.SignUp {...props} />;
  }

  const { setSignedIn } = useContext(MockClerkContext);
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullname) return;

    setIsLoading(true);
    setLoadingStep("Provisioning custom PostgreSQL profile via Prisma...");

    setTimeout(() => {
      setLoadingStep("Configuring local Clerk token session...");
      setTimeout(() => {
        setSignedIn(true);
        const segments = pathname.split("/");
        const locale = segments[1] || "en";
        router.push(`/${locale}`);
      }, 600);
    }, 600);
  };

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true);
    setLoadingStep(`Contacting mock ${provider} OAuth gateway...`);

    setTimeout(() => {
      setLoadingStep("Provisioning user record inside backend...");
      setTimeout(() => {
        setSignedIn(true);
        const segments = pathname.split("/");
        const locale = segments[1] || "en";
        router.push(`/${locale}`);
      }, 600);
    }, 600);
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-indigo-500/10 blur-[40px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[120px] h-[120px] rounded-full bg-pink-500/10 blur-[40px] pointer-events-none" />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 blur animate-pulse" />
            <div className="relative bg-slate-950 p-4 rounded-full border border-slate-800">
              <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
            </div>
          </div>
          <p className="text-sm font-semibold tracking-tight text-white mt-4">
            {loadingStep}
          </p>
          <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            Clerk Sandbox Dev mode
          </span>
        </div>
      ) : (
        <form onSubmit={handleMockSubmit} className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-indigo-400 mr-2 shrink-0 animate-pulse" />
              Create Account
            </h2>
            <p className="text-xs text-slate-400 mt-1.5">
              Begin mapping linguistic perception and cognitive bias
            </p>
          </div>

          {/* Social Sign-Up */}
          <button
            type="button"
            onClick={() => handleOAuthLogin("Google")}
            className="w-full flex items-center justify-center space-x-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-200 hover:text-white transition duration-300"
          >
            {/* Custom Google SVG Icon */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.93 1 12 1 7.35 1 3.39 3.65 1.45 7.55l3.77 2.92C6.12 7.02 8.84 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.45 12.3c0-.82-.07-1.6-.21-2.3H12v4.4h6.43c-.28 1.44-1.1 2.67-2.33 3.5l3.6 2.8c2.1-1.94 3.75-4.8 3.75-8.4z"
              />
              <path
                fill="#FBBC05"
                d="M5.22 14.77a7.07 7.07 0 0 1 0-4.54L1.45 7.31a11.96 11.96 0 0 0 0 9.38l3.77-2.92z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.8c-1.1.74-2.52 1.18-4.36 1.18-3.16 0-5.88-1.98-6.83-5.43L1.4 16.03C3.34 19.9 7.3 23 12 23z"
              />
            </svg>
            <span>Sign Up with Google</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-900" />
            <span className="flex-shrink mx-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              Or email
            </span>
            <div className="flex-grow border-t border-slate-900" />
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
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
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Create Password
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
                  placeholder="Minimum 8 characters"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.01] transition duration-300"
          >
            <span>Register & Start Free</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>

          {/* Links */}
          <p className="text-center text-[11px] text-slate-400">
            Already have an account?{" "}
            <span
              onClick={() => {
                const segments = pathname.split("/");
                const locale = segments[1] || "en";
                router.push(`/${locale}/sign-in`);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors"
            >
              Sign In here
            </span>
          </p>
        </form>
      )}
    </div>
  );
}
