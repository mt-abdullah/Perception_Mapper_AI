"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles, AlertCircle, RefreshCw, CheckCircle, Newspaper, Heart, Briefcase } from "lucide-react";
import { fetchAIRephrasings } from "../../lib/api";

interface RephraseSandboxProps {
  isOpen: boolean;
  onClose: () => void;
  quote: string;
  language: string;
  onSelectRephrase: (rephrasedText: string) => void;
}

export default function RephraseSandbox({
  isOpen,
  onClose,
  quote,
  language,
  onSelectRephrase,
}: RephraseSandboxProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<{
    journalistic: string;
    empathetic: string;
    professional: string;
  } | null>(null);
  const [appliedStyle, setAppliedStyle] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && quote) {
      setLoading(true);
      setError(null);
      setAlternatives(null);
      setAppliedStyle(null);

      fetchAIRephrasings(quote, language)
        .then((res) => {
          if (res.success && res.alternatives) {
            setAlternatives(res.alternatives);
          } else {
            setError("Unable to retrieve AI alternatives from the engine.");
          }
        })
        .catch((err) => {
          setError(err.message || "An unexpected error occurred while rephrasing.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, quote, language]);

  if (!isOpen) return null;

  const handleApply = (style: string, text: string) => {
    setAppliedStyle(style);
    setTimeout(() => {
      onSelectRephrase(text);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Decorative background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/5 blur-[80px] pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900/80 relative z-10 select-none">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4.5 w-4.5 text-purple-400 animate-pulse" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AI Rephrase Sandbox
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white rounded-lg transition duration-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          {/* Source Quote */}
          <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60">
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Original Flagged Context</span>
            <p className="text-xs text-slate-300 italic font-mono leading-relaxed">"{quote}"</p>
          </div>

          {/* AI Loader */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="h-6 w-6 text-purple-400 animate-spin" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                Consulting AI Models...
              </span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-950/20 text-rose-400 flex items-center space-x-3 text-xs">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">Execution Interrupted</p>
                <p className="text-[10px] text-rose-450 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Alternatives Grid */}
          {alternatives && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in slide-in-from-bottom-4 duration-500">
              {/* Journalistic / Factual Card */}
              <div 
                onClick={() => handleApply("journalistic", alternatives.journalistic)}
                className={`relative group cursor-pointer border rounded-xl p-4 transition-all duration-300 flex flex-col justify-between h-[210px] select-none hover:scale-[1.02] ${
                  appliedStyle === "journalistic" 
                    ? "bg-indigo-950/30 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                    : "bg-slate-950/40 border-slate-900 hover:border-indigo-500/40 hover:bg-indigo-950/5"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1.5">
                      <Newspaper className="h-4 w-4 text-indigo-400" />
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-200">Journalistic</span>
                    </div>
                    {appliedStyle === "journalistic" && <CheckCircle className="h-4.5 w-4.5 text-indigo-400" />}
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-slate-400 group-hover:text-slate-200 transition-colors">
                    {alternatives.journalistic}
                  </p>
                </div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-indigo-400 group-hover:underline self-end">
                  Apply Style
                </div>
              </div>

              {/* Empathetic / Warm Card */}
              <div 
                onClick={() => handleApply("empathetic", alternatives.empathetic)}
                className={`relative group cursor-pointer border rounded-xl p-4 transition-all duration-300 flex flex-col justify-between h-[210px] select-none hover:scale-[1.02] ${
                  appliedStyle === "empathetic" 
                    ? "bg-teal-950/30 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.2)]" 
                    : "bg-slate-950/40 border-slate-900 hover:border-teal-500/40 hover:bg-teal-950/5"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1.5">
                      <Heart className="h-4 w-4 text-teal-400" />
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-200">Empathetic</span>
                    </div>
                    {appliedStyle === "empathetic" && <CheckCircle className="h-4.5 w-4.5 text-teal-400" />}
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-slate-400 group-hover:text-slate-200 transition-colors">
                    {alternatives.empathetic}
                  </p>
                </div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-teal-400 group-hover:underline self-end">
                  Apply Style
                </div>
              </div>

              {/* Professional / Clear Card */}
              <div 
                onClick={() => handleApply("professional", alternatives.professional)}
                className={`relative group cursor-pointer border rounded-xl p-4 transition-all duration-300 flex flex-col justify-between h-[210px] select-none hover:scale-[1.02] ${
                  appliedStyle === "professional" 
                    ? "bg-purple-950/30 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                    : "bg-slate-950/40 border-slate-900 hover:border-purple-500/40 hover:bg-purple-950/5"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1.5">
                      <Briefcase className="h-4 w-4 text-purple-400" />
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-200">Professional</span>
                    </div>
                    {appliedStyle === "professional" && <CheckCircle className="h-4.5 w-4.5 text-purple-400" />}
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-slate-400 group-hover:text-slate-200 transition-colors">
                    {alternatives.professional}
                  </p>
                </div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-purple-400 group-hover:underline self-end">
                  Apply Style
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 border-t border-slate-900 bg-slate-955/65 text-[9px] font-bold text-slate-500 uppercase tracking-wider text-center">
          ⚡ Selecting a style inserts it directly into your dashboard playground editor.
        </div>
      </div>
    </div>
  );
}
