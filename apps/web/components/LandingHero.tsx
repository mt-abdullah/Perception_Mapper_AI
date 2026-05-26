"use client";

import React from "react";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { Badge } from "@perception-mapper/ui";

interface LandingHeroProps {
  onSignUp: () => void;
  loadingAction: string | null;
}

export default function LandingHero({ onSignUp, loadingAction }: LandingHeroProps) {
  return (
    <div className="text-center max-w-4xl mx-auto space-y-6 relative pt-12">
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none animate-pulse" />
      
      <Badge variant="info" className="px-3.5 py-1 text-[10px] tracking-widest font-extrabold shadow-sm bg-indigo-950/60 border border-indigo-500/20 text-indigo-400">
        ✨ SUPERNOVA AI PLATFORM v1.0 ENTERPRISE
      </Badge>
      
      <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
        The Advanced Cognitive <br />
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          Perception Security Suite
        </span>
      </h2>
      
      <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Analyze sentiment, tone, and hidden cognitive biases instantly. Leverage real-time acoustic deciphering and optical OCR text scanning for secure multilingual documents.
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 relative z-10">
        <button
          onClick={onSignUp}
          disabled={loadingAction === "sign-up"}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl px-7 py-3.5 text-sm font-bold shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition duration-300 disabled:opacity-50"
        >
          {loadingAction === "sign-up" && (
            <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" />
          )}
          <span>Deploy Workspace Handshake</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
        
        <a
          href="#interactive-trial"
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl px-7 py-3.5 text-sm font-bold transition duration-300"
        >
          <span>Try baseline trial</span>
        </a>
      </div>
    </div>
  );
}
