"use client";

import React from "react";
import { Card } from "@perception-mapper/ui";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

interface LandingPricingProps {
  onSignUp?: () => void;
}

export default function LandingPricing({ onSignUp }: LandingPricingProps) {
  const router = useRouter();
  const pathname = usePathname();

  const plans = [
    { title: "Acoustic Basic", price: "$0", desc: "For independent writers scanning simple drafts.", features: ["✓ 50 Paragraph Analysis / Month", "✓ Basic English parsing", "✓ OCR presets scan validation"], border: "border-slate-900 bg-slate-950/40", pro: false },
    { title: "Pro Workspace", price: "$29", desc: "For professional researchers requiring fast nodes.", features: ["✓ 500 Paragraphs Analysis / Month", "✓ Multilingual (EN, TA, SI)", "✓ Full Speech Synthesis readouts"], border: "border-indigo-650/80 bg-slate-950/50 shadow-indigo-500/5", pro: true },
    { title: "Enterprise OS", price: "$99", desc: "For teams requiring safety policies compliance.", features: ["✓ Unlimited Analysis requests", "✓ Custom Safety Rules Persistence", "✓ Live Telemetry Log Feeds"], border: "border-slate-900 bg-slate-950/40", pro: false }
  ];

  const handleAction = () => {
    if (onSignUp) {
      onSignUp();
    } else {
      const locale = pathname.split("/")[1] || "en";
      router.push(`/${locale}/sign-in`);
    }
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
              {plan.pro && (
                <div className="absolute top-0 right-0 w-[100px] h-[100px] rounded-full bg-indigo-500/10 blur-[20px] pointer-events-none" />
              )}
              <div className="space-y-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest block ${plan.pro ? "text-indigo-400" : "text-slate-550"}`}>
                  {plan.title}
                </span>
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
                onClick={handleAction}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center font-sans tracking-wide uppercase ${
                  plan.pro
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10"
                    : "bg-slate-900 hover:bg-slate-800 text-white border border-slate-800"
                }`}
              >
                {plan.pro ? "Deploy Pro Workspace" : "Initialize Workspace"}
              </button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
