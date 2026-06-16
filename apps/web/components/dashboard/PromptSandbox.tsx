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
        <button onClick={() => setPrompt(defaultPrompt)} className="flex items-center space-x-1 px-2.5 py-1 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-[9px] font-bold text-slate-500 hover:text-slate-300 rounded-lg transition">
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
              className="w-full bg-slate-950/80 border border-slate-900 focus:border-purple-500 focus:outline-none rounded-xl p-3.5 text-[10.5px] font-mono leading-relaxed text-slate-300 h-28 resize-none"
            />
          </div>
          <div>
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Dry-Run Test Input</span>
            <input
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-900 focus:border-purple-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-[10.5px] text-slate-300 font-sans"
            />
          </div>
        </div>

        <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
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

      {/* Developer API Console & Playground Code Generator */}
      <div className="border-t border-slate-900 mt-8 pt-6 space-y-4 text-left">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Developer API Integration Console</h3>
        </div>
        <p className="text-[10px] text-slate-400">
          Access automated multilingual perception audits inside your publishing queue or custom pipelines by routing payload triggers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 bg-slate-950/80 border border-slate-900 rounded-xl p-4 space-y-3.5">
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 block">X-API-Key Configuration</span>
            <div className="bg-slate-950 border border-slate-900 rounded-lg p-2.5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-indigo-400 select-all font-bold">pm_key_team_pro_2026</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 font-extrabold">ACTIVE</span>
            </div>
            <p className="text-[9px] text-slate-500 leading-relaxed">
              Subscribers can pass this authenticated header within integration environments to verify transactions.
            </p>
          </div>

          <div className="md:col-span-2 bg-slate-950/80 border border-slate-900 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900/60 pb-2">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Playground Code Generator</span>
              <span className="text-[8px] text-indigo-400 font-bold uppercase">Rate limit: 120/min</span>
            </div>

            <div className="space-y-2">
              {/* Interactive Tabs */}
              <div className="flex space-x-2 border-b border-slate-900 pb-2">
                <button className="px-2.5 py-1 text-[9px] font-bold text-white bg-slate-900 border border-slate-800 rounded-md">cURL</button>
                <button className="px-2.5 py-1 text-[9px] font-bold text-slate-400 hover:text-white transition">Node.js</button>
                <button className="px-2.5 py-1 text-[9px] font-bold text-slate-400 hover:text-white transition">Python</button>
              </div>

              {/* Code Snippet Box */}
              <pre className="bg-slate-950 border border-slate-900 rounded-lg p-3 text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
{`curl -X POST http://localhost:3001/api/analyze/developer \\
  -H "X-API-Key: pm_key_team_pro_2026" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Obviously unbelievable disaster."}'`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
