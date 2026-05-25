"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/clerk-compat";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, user, setRole } = useAuth();

  // Protect route
  useEffect(() => {
    if (!isSignedIn) {
      const locale = pathname.split('/')[1] || 'en';
      router.push(`/${locale}/sign-in`);
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) {
    return null; // Redirecting
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/90 backdrop-blur-md rounded-xl p-6 glass"
        >
          <h2 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h2>
          <p className="mb-4">Here you can monitor live telemetry, manage projects, and access AI insights.</p>
          {/* Placeholder sections */}
          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Live Telemetry</h3>
            <p className="text-sm text-slate-400">[Telemetry widgets go here]</p>
          </section>
          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Recent Analyses</h3>
            <p className="text-sm text-slate-400">[Recent AI analysis cards]</p>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
