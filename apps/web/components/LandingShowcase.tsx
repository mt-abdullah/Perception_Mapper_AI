"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Play, Radio } from "lucide-react";
import { Badge } from "@perception-mapper/ui";

export default function LandingShowcase() {
  return (
    <div id="showcase" className="w-full max-w-5xl mx-auto py-16 space-y-10 relative z-10 select-none">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Intuitive Interactive Workbench
        </h3>
        <p className="text-xs text-slate-400">
          Manage live telemetry logs streams and clean cognitive rephraser purges from a single command portal.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="rounded-2xl border border-slate-900 bg-slate-950/60 p-2.5 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="scanner-line" />
        
        <div className="p-6 rounded-xl border border-slate-900 bg-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-md text-left">
            <span className="inline-flex items-center text-[9px] font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-500/20 rounded px-2 py-0.5 uppercase tracking-widest">
              <Radio className="h-2.5 w-2.5 mr-1 animate-pulse" /> Live Telemetry
            </span>
            <h4 className="text-lg font-bold text-white">Orbital Node Transaction logs</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Observe transaction cycles and packet evaluations stream from active server nodes. Cleanse biased patterns and readout balanced statements using voice readouts.
            </p>
            <div className="flex space-x-3 text-[10px] font-bold uppercase text-slate-500">
              <span className="flex items-center"><ShieldCheck className="h-4 w-4 mr-1 text-emerald-400" /> Active SSL</span>
              <span className="flex items-center"><Play className="h-4 w-4 mr-1 text-indigo-400" /> Fast Execution</span>
            </div>
          </div>

          <div className="w-full md:w-[480px] bg-slate-950/90 border border-slate-900 rounded-xl p-4 font-mono text-[9px] text-emerald-400 space-y-2 h-44 overflow-y-auto">
            <div className="text-slate-500 font-semibold select-none mb-1">❯ ESTABLISHING CORE AI INTERACTIVE CONNECTIONS...</div>
            <div className="truncate"><span className="text-indigo-400 font-bold">❯</span> [08:50:12] SSE TELEMETRY PORT 3001 ESTABLISHED</div>
            <div className="truncate"><span className="text-indigo-400 font-bold">❯</span> [08:50:13] fastapi NLP COGNITIVE SIDECAR HEURISTICS CONNECTED</div>
            <div className="truncate"><span className="text-indigo-400 font-bold">❯</span> [08:50:14] EVALUATING INPUT TEXT BLOCKS CLASSIFICATION</div>
            <div className="truncate text-indigo-400"><span className="text-indigo-400 font-bold">❯</span> [08:50:15] Objectivity Weight resolved at 78%</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
