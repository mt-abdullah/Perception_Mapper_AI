"use client";

import React from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";
import { Badge } from "@perception-mapper/ui";
import { AnalysisResult } from "../types";
import TTSReadout from "./dashboard/TTSReadout";

interface CognitiveAnalyticsProps {
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  onRephrase: (quote: string, rephrase: string) => void;
  onExploreRephrase: (quote: string) => void;
}

export default function CognitiveAnalytics({ analysisResult, isAnalyzing, onRephrase, onExploreRephrase }: CognitiveAnalyticsProps) {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
        <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Evaluating structures...</span>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="flex items-center justify-center text-center py-20 text-slate-600 font-mono text-xs select-none">
        Launch scanning sequence above to compile perception metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs animate-in fade-in duration-300">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Objectivity Index", val: analysisResult.scores.objectivity, color: "text-indigo-500" },
          { label: "Bias Risk Index", val: analysisResult.scores.biasIndex, color: "text-pink-500" }
        ].map((gauge, i) => (
          <div key={i} className="p-4 rounded-xl border border-slate-900 bg-slate-950 text-center flex flex-col items-center space-y-2">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">{gauge.label}</span>
            <div className="relative flex items-center justify-center w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-900" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className={`${gauge.color} transition-all duration-1000`} strokeDasharray={`${gauge.val}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-xs font-bold text-white">{gauge.val}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 bg-slate-950 border border-slate-900 p-4 rounded-xl">
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Tone breakdowns</span>
        {analysisResult.tones.map((t, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-300">
              <span>{t.name}</span>
              <span className="font-mono text-slate-500">{t.score}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1">
              <div className={`bg-gradient-to-r ${t.color} h-full rounded-full`} style={{ width: `${t.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 pr-1 max-h-[160px] overflow-y-auto">
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Matched Bias Indicators</span>
        {analysisResult.biases.map((b, idx) => (
          <div key={idx} className="p-2.5 rounded-lg border border-slate-900 bg-slate-950/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400 text-[10px] flex items-center">
                <ShieldAlert className="h-3 w-3 mr-1 text-pink-400" /> {b.type}
              </span>
              <Badge variant="neutral" className="text-[8px] lowercase font-mono">Recommend Rephrase</Badge>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <p className="text-[10px] text-slate-300 italic">"{b.quote}"</p>
              <div className="flex items-center space-x-1.5 shrink-0">
                <button 
                  onClick={() => onExploreRephrase(b.quote)}
                  className="px-1.5 py-0.5 text-[8px] font-bold text-indigo-400 border border-indigo-500/20 hover:border-indigo-500 bg-indigo-950/15 hover:bg-indigo-950/30 rounded transition"
                  title="Explore AI Rephrasings"
                >
                  AI Co-pilot
                </button>
                <TTSReadout text={b.quote} mode="emotional" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-900">
              <span className="text-[9px] text-slate-500">💡 Substitute:</span>
              <div className="flex items-center space-x-2">
                <button onClick={() => onRephrase(b.quote, b.rephrase)} className="text-emerald-400 font-bold hover:underline">
                  "{b.rephrase}"
                </button>
                <TTSReadout text={b.rephrase} mode="neutral" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
