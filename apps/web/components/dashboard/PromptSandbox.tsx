"use client";

import React, { useState } from "react";
import { Terminal, Shield, Play, RotateCcw } from "lucide-react";

export default function PromptSandbox() {
  const defaultPrompt = "You are a neutral linguistic security auditor. Extract all subjective intensifiers, loaded bias quote parameters, and emotional intensifiers, and replace them with objective alternatives.";
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [sandboxInput, setSandboxInput] = useState("We are completely thrilled to announce that this spectacular release is incredibly revolutionary!");
  const [sandboxOutput, setSandboxOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleDryRun = () => {
    if (!sandboxInput || isRunning) return;
    setIsRunning(true);
    setTimeout(() => {
      // Simulate prompt directives override on input
      if (prompt.toLowerCase().includes("extreme") || prompt.toLowerCase().includes("neutral")) {
        setSandboxOutput("We announce that this release is active and deployed.");
      } else {
        setSandboxOutput("We announce that this release is functional.");
      }
      setIsRunning(false);
    }, 900);
  };

  return (
    <div className="bg-slate-950/40 border border-slate-900/60 backdrop-blur-md rounded-2xl p-6 relative select-none font-sans overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-6">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-purple-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">System Directives Sandbox</h3>
        </div>
        <button onClick={() => setPrompt(defaultPrompt)} className="flex items-center space-x-1 px-2.5 py-1 bg-slate-900/60 hover:bg-slate-800 border border-slate-850 text-[9px] font-bold text-slate-500 hover:text-slate-300 rounded-lg transition">
          <RotateCcw className="h-3 w-3" />
          <span>Reset Prompt</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
        <div className="space-y-4">
          <div>
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">System Prompt Instructions</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-955/80 border border-slate-900 focus:border-purple-500 focus:outline-none rounded-xl p-3.5 text-[10.5px] font-mono leading-relaxed text-slate-300 h-28 resize-none"
            />
          </div>
          <div>
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Dry-Run Test Input</span>
            <input
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              className="w-full bg-slate-955/80 border border-slate-900 focus:border-purple-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-[10.5px] text-slate-300 font-sans"
            />
          </div>
        </div>

        <div className="bg-slate-955/50 border border-slate-900 rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-3.5">
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 block">Dry-Run Output Auditing</span>
            {sandboxOutput ? (
              <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl space-y-2">
                <div className="flex items-center space-x-1.5">
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wide">Directive override verified</span>
                </div>
                <p className="text-[10px] text-slate-300 italic">"{sandboxOutput}"</p>
              </div>
            ) : (
              <div className="text-center py-8 text-[9px] font-bold uppercase tracking-wider text-slate-600">Awaiting dry-run execution</div>
            )}
          </div>

          <button
            onClick={handleDryRun}
            disabled={isRunning || !sandboxInput}
            className="w-full py-2.5 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition duration-300 disabled:opacity-40 flex items-center justify-center space-x-1.5"
          >
            {isRunning ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                <span>Scanning Sandbox Vector...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Execute Sandbox Heuristic</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
