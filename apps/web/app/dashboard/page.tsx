"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Preloader from "../../components/Preloader";
import ActivePlanWidget from "../../components/dashboard/ActivePlanWidget";
import { Zap, Flame, ShieldCheck, ArrowRight } from "lucide-react";
import { Card } from "@perception-mapper/ui";

export default function DashboardHome() {
  const router = useRouter();
  const { isSignedIn, user, mounted, setTier } = useAuth();

  useEffect(() => {
    if (mounted && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [mounted, isSignedIn, router]);

  if (!mounted || !isSignedIn || !user) {
    return <Preloader message="CONNECTING PERCEPTION CONSOLE..." />;
  }

  const dashboards = [
    {
      title: "Free Console",
      desc: "Acoustic basic semantic gateways. Evaluates textual inputs and clears baseline emotional expressions.",
      href: "/dashboard/free",
      color: "from-slate-500 to-slate-700 text-slate-400 border-slate-900/60 shadow-slate-950/20",
      accent: "text-slate-400",
      icon: Zap,
      badge: "Free Gateway"
    },
    {
      title: "Basic Console",
      desc: "Pro workspace suite overlays. Accesses live telemetry graphs and dynamic custom overrides rules engines.",
      href: "/dashboard/basic",
      color: "from-blue-500 to-indigo-650 text-blue-400 border-blue-900/30 shadow-blue-950/20",
      accent: "text-blue-400",
      icon: Flame,
      badge: "Basic Scope"
    },
    {
      title: "Pro Console",
      desc: "Enterprise OS security telemetry. Seamlessly streams log lines and allocates seats in team workspaces.",
      href: "/dashboard/pro",
      color: "from-purple-600 to-amber-650 text-purple-400 border-purple-900/30 shadow-purple-950/25",
      accent: "text-amber-400",
      icon: ShieldCheck,
      badge: "Pro Core"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-955 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-25%] w-[80%] h-[80%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />
      <Navbar />

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-24 space-y-12 relative z-10 select-none">
        <div className="text-center space-y-4 max-w-2xl mx-auto pt-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase">
            Perception Command Gateway
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Select your active telemetry console scope below to monitor cognitive sentiment indices, rephrase subjective phrases, and audit transaction records.
          </p>
        </div>

        <ActivePlanWidget currentTier={user.tier} setTier={setTier} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dashboards.map((db, i) => {
            const Icon = db.icon;
            return (
              <Card key={i} className={`p-6 border bg-slate-950/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between min-h-[300px] shadow-2xl hover:border-slate-800 ${db.color}`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 bg-slate-955/60 border border-slate-900 rounded-full tracking-wider">
                      {db.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white tracking-wider uppercase text-left">{db.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold text-left">{db.desc}</p>
                </div>

                <button onClick={() => router.push(db.href)} className="w-full mt-6 py-3 bg-slate-900 hover:bg-slate-850 hover:border-slate-800 border border-slate-950 text-[10px] font-bold uppercase tracking-wider text-slate-350 hover:text-white rounded-xl transition duration-300 flex items-center justify-center space-x-1.5 cursor-pointer">
                  <span>Open Console</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Card>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const dynamic = "force-dynamic";
