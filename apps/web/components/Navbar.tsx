"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, user, signOut, mounted } = useAuth();

  const homeHref = isSignedIn
    ? (user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard")
    : "/";

  const navItems = user?.role === "ADMIN"
    ? [{ name: "Admin Panel", href: "/admin/dashboard" }]
    : [];

  const landingNavItems = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Showcase", href: "#showcase" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  if (!mounted) {
    return <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-955/80 backdrop-blur-xl border-b border-slate-900/60 h-16" />;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={homeHref} className="text-white font-extrabold text-sm tracking-widest uppercase hover:text-indigo-400 transition select-none">
            Perception Mapper AI
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-400">
            {!isSignedIn && landingNavItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="transition hover:text-white"
              >
                {item.name}
              </a>
            ))}
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition ${pathname === item.href ? "text-indigo-400" : "hover:text-white"}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <span className="hidden sm:inline text-[9px] font-bold text-slate-500 uppercase tracking-widest select-none">
                  ({user?.role})
                </span>
                <button
                  onClick={signOut}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <button className="px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition">
                    Sign In
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="px-4 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 rounded-xl transition duration-300 shadow-md">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900/50 transition"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-slate-955 border-t border-slate-900/60 px-4 pb-4 pt-2 space-y-2 select-none">
          {!isSignedIn && landingNavItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-355 hover:text-white hover:bg-slate-900/50 transition"
            >
              {item.name}
            </a>
          ))}
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-355 hover:text-white hover:bg-slate-900/50 transition"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
