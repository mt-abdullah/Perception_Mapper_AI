"use client";

import React, { useState } from "react";
import { Network, Zap, ShieldCheck } from "lucide-react";

interface Node { id: string; label: string; group: "bias" | "intensifier" | "rule"; color: string; desc: string }
interface Link { source: string; target: string }

export default function BiasNetworkGraph() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const nodes: Node[] = [
    { id: "1", label: "Subjective Bias", group: "bias", color: "fill-cyan-400 stroke-cyan-500", desc: "Implicit sentiment weights representing emotional opinions." },
    { id: "2", label: "Polarizing Tone", group: "bias", color: "fill-indigo-400 stroke-indigo-500", desc: "Highly emotional or extreme phrases that distort sentence neutrality." },
    { id: "3", label: "மிகவும் (Very)", group: "intensifier", color: "fill-purple-400 stroke-purple-500", desc: "Tamil linguistic intensifier triggering loaded bias checks." },
    { id: "4", label: "ඉතා (Extremely)", group: "intensifier", color: "fill-pink-400 stroke-pink-500", desc: "Sinhala intensify marker indicating high sentiment amplitude." },
    { id: "5", label: "Linguistic Guardrails", group: "rule", color: "fill-emerald-400 stroke-emerald-500", desc: "Active safety rules enforcing absolute objective rephrasing." }
  ];

  const links: Link[] = [
    { source: "1", target: "2" },
    { source: "1", target: "3" },
    { source: "2", target: "4" },
    { source: "2", target: "5" }
  ];

  const activeLinks = selectedNode
    ? links.filter((l) => l.source === selectedNode.id || l.target === selectedNode.id)
    : links;

  return (
    <div className="bg-slate-950/40 border border-slate-900/60 backdrop-blur-md rounded-2xl p-6 relative select-none font-sans overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-6">
        <div className="flex items-center space-x-2">
          <Network className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Cognitive Map Heuristics</h3>
        </div>
        <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-955/40 border border-cyan-500/20 text-cyan-400">
          2D Vector Map Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 relative bg-slate-955/50 border border-slate-900/80 rounded-xl flex items-center justify-center p-4 min-h-[220px]">
          <svg className="w-full max-w-[340px] h-[200px]" viewBox="0 0 340 200">
            {/* Connection Lines */}
            {activeLinks.map((link, idx) => {
              const from = nodes.find((n) => n.id === link.source);
              const to = nodes.find((n) => n.id === link.target);
              if (!from || !to) return null;
              
              const coordinates: Record<string, {x: number, y: number}> = {
                "1": { x: 70, y: 100 },
                "2": { x: 170, y: 100 },
                "3": { x: 120, y: 40 },
                "4": { x: 220, y: 40 },
                "5": { x: 270, y: 100 }
              };
              const c1 = coordinates[link.source];
              const c2 = coordinates[link.target];
              return (
                <line
                  key={idx}
                  x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y}
                  className="stroke-indigo-500/25 stroke-[1.5] animate-pulse"
                />
              );
            })}

            {/* Nodes */}
            {[{ id: "1", x: 70, y: 100 }, { id: "2", x: 170, y: 100 }, { id: "3", x: 120, y: 40 }, { id: "4", x: 220, y: 40 }, { id: "5", x: 270, y: 100 }].map((n) => {
              const node = nodes.find((item) => item.id === n.id)!;
              const isSelected = selectedNode?.id === node.id;
              return (
                <g key={n.id} className="cursor-pointer" onClick={() => setSelectedNode(node)}>
                  {isSelected && (
                    <circle cx={n.x} cy={n.y} r={16} className="fill-none stroke-indigo-400/40 stroke-[2] animate-ping" />
                  )}
                  <circle cx={n.x} cy={n.y} r={8} className={`${node.color} stroke-[2] transition duration-300 ${isSelected ? "scale-125" : "hover:scale-110"}`} />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 min-h-[220px] flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-3 text-left">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 block">Node Details</span>
              <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span>{selectedNode.label}</span>
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{selectedNode.desc}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-8">
              <ShieldCheck className="h-8 w-8 text-slate-700 animate-bounce" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Select node to analyze correlation</p>
            </div>
          )}
          {selectedNode && (
            <button onClick={() => setSelectedNode(null)} className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 text-[9px] font-bold rounded-lg transition">
              Reset Vector Scope
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
