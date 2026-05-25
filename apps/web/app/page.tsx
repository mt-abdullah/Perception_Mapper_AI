// apps/web/app/page.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white p-8">
      <h1 className="text-5xl font-bold mb-4 text-center drop-shadow-lg">
        Perception Mapper AI
      </h1>
      <p className="text-lg max-w-2xl text-center mb-8">
        Advanced AI-powered security and data insights platform.
      </p>
      <div className="flex space-x-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          Sign In
        </Link>
      </div>
    </section>
  );
}
