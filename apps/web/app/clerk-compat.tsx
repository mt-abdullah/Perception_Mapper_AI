"use client";

import React, { createContext, useContext, useState } from "react";
import * as RealClerk from "@clerk/nextjs";

const hasRealClerkKey =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder") &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_");

// Define a local mock context for dev mode
const MockClerkContext = createContext<{
  isSignedIn: boolean;
  setSignedIn: (val: boolean) => void;
}>({
  isSignedIn: true, // Default to signed-in for seamless dev testing
  setSignedIn: () => {},
});

export function ClerkProvider({ children, ...props }: any) {
  const [isSignedIn, setSignedIn] = useState(true);

  if (hasRealClerkKey) {
    return <RealClerk.ClerkProvider {...props}>{children}</RealClerk.ClerkProvider>;
  }

  return (
    <MockClerkContext.Provider value={{ isSignedIn, setSignedIn }}>
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
  if (hasRealClerkKey) {
    return <RealClerk.SignInButton mode={mode}>{children}</RealClerk.SignInButton>;
  }

  const { setSignedIn } = useContext(MockClerkContext);
  const triggerMockSignIn = () => {
    setSignedIn(true);
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick: triggerMockSignIn });
  }

  return (
    <button
      onClick={triggerMockSignIn}
      className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition duration-300 shadow shadow-indigo-500/10"
    >
      Sign In
    </button>
  );
}

export function UserButton(props: any) {
  if (hasRealClerkKey) {
    return <RealClerk.UserButton {...props} />;
  }

  const { setSignedIn } = useContext(MockClerkContext);
  return (
    <button
      onClick={() => setSignedIn(false)}
      className="px-3 py-1.5 text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 rounded-xl hover:text-white hover:border-slate-700 transition"
    >
      Sign Out (Mock)
    </button>
  );
}
