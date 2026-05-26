import React from "react";
import { Card } from "@perception-mapper/ui";
import { Globe, Mic, Cpu } from "lucide-react";

export default function LandingFeatures() {
  const features = [
    {
      title: "Multilingual Linguistic Analysis",
      desc: "Scan and detect linguistic sentiment and implicit cognitive bias patterns in English, Tamil, and Sinhala.",
      icon: <Globe className="h-5 w-5" />,
      color: "bg-indigo-950/60 border-indigo-500/20 text-indigo-400",
      glow: "bg-indigo-500/5",
    },
    {
      title: "Speech Acoustic Scan",
      desc: "Trigger voice-to-text acoustic translation. Readout balanced statements using native neural voice synthesis.",
      icon: <Mic className="h-5 w-5" />,
      color: "bg-purple-950/60 border-purple-500/20 text-purple-400",
      glow: "bg-purple-500/5",
    },
    {
      title: "Optical OCR Scanner",
      desc: "Extract text layout manifests from border documents or logistics checklists with high-fidelity accuracy.",
      icon: <Cpu className="h-5 w-5" />,
      color: "bg-pink-950/60 border-pink-500/20 text-pink-400",
      glow: "bg-pink-500/5",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
      {features.map((item, idx) => (
        <Card key={idx} className="p-6 relative group overflow-hidden border-slate-900 bg-slate-950/40 backdrop-blur-md">
          <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full ${item.glow} group-hover:scale-150 transition-all duration-500`} />
          <div className={`${item.color} border p-3 rounded-xl w-11 h-11 flex items-center justify-center mb-5`}>
            {item.icon}
          </div>
          <h4 className="text-base font-bold text-white tracking-wide mb-2.5">
            {item.title}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {item.desc}
          </p>
        </Card>
      ))}
    </div>
  );
}
