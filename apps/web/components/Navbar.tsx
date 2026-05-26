"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, useAuth } from "@/app/clerk-compat";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, user, signOut } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract locale prefix
  const segments = pathname.split("/");
  const locale = segments[1] || "en";

  const handleLogout = () => {
    signOut();
    router.push(`/${locale}`);
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  const navItems = user?.role === "ADMIN"
    ? []
    : [
        { name: "Home", href: `/${locale}` },
        { name: "Dashboard", href: `/${locale}/dashboard` },
      ];

  // Render safe guard during hydration to prevent mismatches
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 h-16" />
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand */}
          <Link href={`/${locale}`} className="flex-shrink-0 text-white font-extrabold text-lg tracking-tight hover:text-indigo-400 transition-colors select-none">
            Perception Mapper AI
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${pathname === item.href ? "text-white bg-slate-800/60" : "text-slate-350 hover:text-white hover:bg-slate-800/30"}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Controls */}
          <div className="flex items-center space-x-2">
            <SignedIn>
              {user?.role === "ADMIN" ? (
                <>
                  {/* Admin Dashboard Link */}
                  <Link href={`/${locale}/admin/dashboard`}>
                    <button className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition duration-300 shadow-md shadow-rose-600/10">
                      Admin Dashboard
                    </button>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 transition duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Dashboard Direct Route */}
                  <Link href={`/${locale}/dashboard`}>
                    <button className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition duration-300 shadow-md shadow-indigo-600/10">
                      Dashboard
                    </button>
                  </Link>

                  {/* Profile (Configuration) Link */}
                  <Link href={`/${locale}/configuration`}>
                    <button className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-700 hover:bg-slate-650 rounded-xl transition duration-300">
                      Profile
                    </button>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 transition duration-300"
                  >
                    Logout
                  </button>
                </>
              )}
            </SignedIn>

            <SignedOut>
              {/* Sign In Link */}
              <Link href={`/${locale}/sign-in`}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 border border-indigo-500/20 rounded-xl shadow-lg shadow-indigo-650/10 transition duration-300"
                >
                  Sign In
                </motion.button>
              </Link>
            </SignedOut>
          </div>

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
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 px-4 pb-4 pt-2 space-y-2 select-none">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <SignedIn>
            <Link href={`/${locale}/configuration`} onClick={() => setMobileOpen(false)} className="block">
              <button className="w-full text-left px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg">
                Config Settings
              </button>
            </Link>
          </SignedIn>
        </div>
      )}
    </nav>
  );
}
