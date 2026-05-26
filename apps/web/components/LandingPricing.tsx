"use client";

import React from "react";
import { Card } from "@perception-mapper/ui";
import { RefreshCw } from "lucide-react";

interface LandingPricingProps {
  onSignUp: () => void;
  loadingAction: string | null;
}

export default function LandingPricing({ onSignUp, loadingAction }: LandingPricingProps) {
  const plans = [
    {
      title: "Acoustic Basic",
      price: "$0",
      features: ["✓ 50 Paragraph Analysis / Month", "✓ Basic English parsing", "✓ OCR Presets validation"],
      style: "border-slate-900/80",
      btnText: "Initialize Free Access",
    },
    {
      title: "Pro Workspace",
      price: "$29",
      features: ["✓ 500 Paragraphs Analysis / Month", "✓ Multilingual (EN, TA, SI)", "✓ Full Speech Synthesis"],
      style: "border-indigo-900/60 relative",
      btnText: "Deploy Pro Workspace",
      pro: true,
    },
    {
      title: "Enterprise OS",
      price: "$99",
      features: ["✓ Unlimited Analysis requests", "✓ Custom Cognitive Rules", "✓ Live Telemetry Stream"],
      style: "border-purple-900/60",
      btnText: "Establish Gateway",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pt-12 border-t border-slate-900">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold tracking-tight text-white">Futuristic Enterprise Pricing Plans</h3>
        <p className="text-xs text-slate-400">Choose the optimal workspace node allocation for your team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((plan, idx) => (
          <Card key={idx} className={`p-6 text-center space-y-4 ${plan.style} bg-slate-950/40 backdrop-blur-md`}>
            {plan.pro && (
              <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-full bg-indigo-500/10 blur-[15px] pointer-events-none" />
            )}
            <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.pro ? "text-indigo-400" : "text-slate-550"}`}>
              {plan.title}
            </span>
            <h4 className="text-3xl font-extrabold text-white">
              {plan.price} <span className="text-xs text-slate-500 font-semibold">/ month</span>
            </h4>

            <ul className="text-[10px] text-slate-400 space-y-1.5 text-left py-2 border-t border-slate-900">
              {plan.features.map((feat, fIdx) => (
                <li key={fIdx}>{feat}</li>
              ))}
            </ul>
            
            <button
              onClick={onSignUp}
              disabled={loadingAction === "sign-up"}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center disabled:opacity-50 ${
                plan.pro
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-slate-900 hover:bg-slate-800 text-white border border-slate-800"
              }`}
            >
              {loadingAction === "sign-up" && (
                <RefreshCw className="h-3 w-3 animate-spin mr-1.5" />
              )}
              {plan.btnText}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
