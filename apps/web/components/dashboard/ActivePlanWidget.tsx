"use client";

import React from "react";
import { SubscriptionTier } from "../../lib/auth";
import { Zap, Check, Info } from "lucide-react";
import { Card } from "@perception-mapper/ui";

interface ActivePlanWidgetProps {
  currentTier: SubscriptionTier;
  setTier: (tier: SubscriptionTier) => void;
}

export default function ActivePlanWidget({ currentTier, setTier }: ActivePlanWidgetProps) {
  const freeDetails = [
    "Acoustic baseline semantic filters",
    "Standard linguistic tone rephrasing",
    "1 cognitive sandbox workspace node",
    "Max 10,000 characters per analysis",
    "Real-time dynamic bias topology mapping",
    "Standard prompt sandbox with mock APIs"
  ];

  return (
    <Card className="p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md text-left space-y-5 shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900/60 pb-5">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block mb-1">
            Subscription Profile
          </span>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Active Telemetry Scope Plan
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-850 px-3 py-1.5 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400">Current plan:</span>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
              currentTier === "FREE" 
                ? "bg-slate-800 text-slate-350 border border-slate-700" 
                : currentTier === "BASIC"
                ? "bg-blue-950/50 text-blue-400 border border-blue-900/30"
                : "bg-purple-950/50 text-purple-400 border border-purple-900/30"
            }`}>
              {currentTier} Plan
            </span>
          </div>

          {currentTier !== "FREE" ? (
            <button
              onClick={() => setTier("FREE")}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-300 rounded-xl transition duration-350 flex items-center space-x-1.5 cursor-pointer"
            >
              <Zap className="h-3 w-3 text-slate-400" />
              <span>Set Free Plan</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-950/40 border border-indigo-900/30 text-[10px] font-bold text-indigo-400 rounded-xl uppercase tracking-wider">
              <span>Free Plan Active</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-slate-400">
          <Info className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-350">
            Free Plan Console Specifications & Details
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {freeDetails.map((detail, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-950/30 border border-slate-900/40">
              <div className="p-1 rounded-md bg-indigo-950/40 border border-indigo-900/30 shrink-0 mt-0.5">
                <Check className="h-3 w-3 text-indigo-400" />
              </div>
              <span className="text-[11px] text-slate-400 font-semibold leading-normal">
                {detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
