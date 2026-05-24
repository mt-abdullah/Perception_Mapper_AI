"use client";
import React, { useState } from 'react';
import { Sun, Moon, Mic } from 'lucide-react';
import { useTheme } from 'next-themes';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '../app/clerk-compat';
import { Key } from 'lucide-react';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');
  const { isSignedIn, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between bg-surface/80 backdrop-blur-md border-b border-surface p-4 glass">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Perception Mapper AI
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button aria-label="Toggle dark mode" onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-glass transition">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button aria-label="Toggle voice mode" className="p-2 rounded-full hover:bg-surface-glass transition">
            <Mic className="h-5 w-5" />
          </button>
          {/* Hamburger for mobile */}
          <button aria-label="Menu" onClick={toggleMenu} className="sm:hidden p-2 rounded-full hover:bg-surface-glass transition">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
      {/* Mobile drawer */}
      {menuOpen && (
        <aside className="fixed inset-0 z-40" onClick={toggleMenu}>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <nav className="relative bg-slate-900 w-64 h-full p-4" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col space-y-4">
              <SignedIn>
                <div className="flex items-center space-x-2">
                  <img src={user?.avatarUrl} alt={user?.name} className="w-8 h-8 rounded-full" />
                  <div className="flex flex-col text-xs text-white">
                    <span>{user?.name}</span>
                    <span className="bg-indigo-600 text-white rounded px-1 py-0.5">{user?.role}</span>
                  </div>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 rounded-lg hover:border-slate-700 transition">
                    <Key className="h-3 w-3" />
                    <span>Authenticate</span>
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </nav>
        </aside>
      )}
    </>
  );
}
