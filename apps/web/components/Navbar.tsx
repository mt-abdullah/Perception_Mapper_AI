"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@/app/clerk-compat";
import { useAuth } from "@/app/clerk-compat";
// import ConfigurationPanel removed; navigation via page route

const navItems = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn, user } = useAuth();
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
// Configuration modal removed; navigation handled via route

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
      {/* Configuration Panel */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="#home" className="flex-shrink-0 text-white font-bold text-xl tracking-tight hover:text-indigo-400 transition-colors">
            Perception Mapper AI
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              >
                {item.name}
              </a>
            ))}
          </div>
          {/* Auth Controls */}
          <SignedIn>
            {/* User Dashboard Button */}
            <button
              onClick={() => {
                if (!isSignedIn) {
                  router.push('/login');
                  return;
                }
                router.push('/dashboard');
              }}
              disabled={loadingUser}
              className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors disabled:opacity-50"
            >
              Dashboard
            </button>
            {/* Admin Panel Button (visible for admins) */}
            {user?.role === 'ADMIN' && (
              <button
                onClick={async () => {
                  if (!isSignedIn) {
                    router.push('/login');
                    return;
                  }
                  // Optional server-side role verification
                  try {
                    const res = await fetch('/api/admin/validate', { method: 'GET' });
                    if (!res.ok) throw new Error('Not authorized');
                    router.push('/admin');
                  } catch (e) {
                    console.error(e);
                    router.push('/login');
                  }
                }}
                disabled={loadingAdmin}
                className="ml-2 px-3 py-1.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-md transition-colors disabled:opacity-50"
              >
                Admin Panel
              </button>
            )}
            {/* Configuration Link */}
            <Link href="/configuration">
              <button className="ml-2 px-3 py-1.5 text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">
                Config
              </button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
              >
                Sign In
              </motion.button>
            </SignInButton>
          </SignedOut>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 px-4 pb-4 pt-2 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              {item.name}
            </a>
          ))}
          {/* Config Link in mobile */}
          <Link href="/configuration">
            <button className="ml-2 mt-2 w-full px-3 py-1.5 text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">
              Config
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
