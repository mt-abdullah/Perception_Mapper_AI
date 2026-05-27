"use client";

import React from "react";
import { Card } from "@perception-mapper/ui";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface LandingPricingProps {
  onSignUp?: () => void;
}

export default function LandingPricing({ onSignUp }: LandingPricingProps) {
  const router = useRouter();

  const plans = [
    { 
      title: "Free", 
      badge: "Starter", 
      price: "$0", 
      desc: "Perfect for casual writers and individual linguistic testing.", 
      features: [
        "✓ 50 Analyses / Month", 
        "✓ English only parsing", 
        "✓ 3 core cognitive bias types", 
        "✓ Partial tone assessment"
      ], 
      border: "border-slate-900 bg-slate-950/40", 
      highlight: false, 
      btnText: "Start Free", 
      btnClass: "bg-slate-900 hover:bg-slate-800 text-white border border-slate-800",
      planId: "free"
    },
    { 
      title: "Basic", 
      badge: "Popular", 
      price: "$19", 
      desc: "Empowers publishers and professionals with multi-locale analysis.", 
      features: [
        "✓ 500 Analyses / Month", 
        "✓ EN + Tamil + Sinhala", 
        "✓ All cognitive bias types", 
        "✓ Objective rephrasing & CSV/PDF"
      ], 
      border: "border-indigo-650/80 bg-slate-950/50 shadow-indigo-500/5", 
      highlight: true, 
      btnText: "Get Basic", 
      btnClass: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10",
      planId: "basic"
    },
    { 
      title: "Pro", 
      badge: "Teams", 
      price: "$59", 
      desc: "Full-scale workspace pipeline built for agile editing groups.", 
      features: [
        "✓ Unlimited Analysis requests", 
        "✓ API Access + X-API-Key", 
        "✓ Team Workspace integration", 
        "✓ Custom webhooks & priority support"
      ], 
      border: "border-pink-900/40 bg-slate-950/40 shadow-pink-500/5", 
      highlight: false, 
      btnText: "Get Pro", 
      btnClass: "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-md shadow-pink-600/10",
      planId: "pro"
    }
  ];

  const handleAction = (planId: string) => {
    router.push(`/pricing?plan=${planId}`);
  };

  return (
    <div id="pricing" className="w-full max-w-5xl mx-auto py-16 space-y-12 relative z-10 select-none">
      <div className="text-center space-y-3">
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Futuristic Enterprise Pricing Plans
        </h3>
        <p className="text-xs text-slate-400">Choose the optimal workspace node allocation for your team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-stretch">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="flex"
          >
            <Card className={`p-6 text-center space-y-4 rounded-2xl flex flex-col justify-between w-full border relative overflow-hidden backdrop-blur-md shadow-lg ${plan.border}`}>
              {plan.highlight && (
                <div className="absolute top-0 right-0 w-[100px] h-[100px] rounded-full bg-indigo-500/10 blur-[20px] pointer-events-none" />
              )}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.highlight ? "text-indigo-400" : "text-slate-550"}`}>
                    {plan.title}
                  </span>
                  <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full ${plan.highlight ? "bg-indigo-950/60 border border-indigo-500/30 text-indigo-400" : "bg-slate-900 border border-slate-800 text-slate-500"}`}>
                    {plan.badge}
                  </span>
                </div>
                <h4 className="text-3xl font-extrabold text-white">
                  {plan.price} <span className="text-xs text-slate-500 font-semibold">/ month</span>
                </h4>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{plan.desc}</p>
                <ul className="text-[10px] text-slate-400 space-y-2 text-left py-4 border-t border-slate-900">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx}>{feat}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleAction(plan.planId)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center font-sans tracking-wide uppercase ${plan.btnClass}`}
              >
                {plan.btnText}
              </button>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center pt-4">
        <a
          href="/pricing"
          className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-350 transition duration-200"
        >
          <span>Compare full features & billing plans</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
