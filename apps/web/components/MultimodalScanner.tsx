"use client";

import React from "react";
import { Textarea, Button } from "@perception-mapper/ui";
import { Layers, Play, RefreshCw, Mic } from "lucide-react";
import { VOICE_PRESETS, IMAGE_PRESETS } from "../lib/constants";

interface MultimodalScannerProps {
  inputText: string;
  setInputText: (text: string) => void;
  activeTab: "text" | "voice" | "image";
  setActiveTab: (tab: "text" | "voice" | "image") => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isAnalyzing: boolean;
  triggerAnalysis: (text?: string) => void;
  appendTerminalLog: (log: string) => void;
}

export default function MultimodalScanner({
  inputText, setInputText,
  activeTab, setActiveTab,
  selectedLanguage, setSelectedLanguage,
  isAnalyzing, triggerAnalysis, appendTerminalLog
}: MultimodalScannerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Omnibox Playground</h3>
        </div>
        <div className="flex bg-slate-950 border border-slate-850 rounded-lg p-0.5 text-[9px] font-bold">
          {(["text", "voice", "image"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); appendTerminalLog(`📡 MODE SWAP: ${tab}`); }}
              className={`px-2.5 py-1 rounded transition capitalize ${activeTab === tab ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-350"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "text" && (
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter paragraph to analyze..."
          className="text-xs h-36 font-mono text-slate-200 bg-slate-950 border-slate-850 focus:border-indigo-500"
        />
      )}

      {activeTab === "voice" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
          <button
            onClick={() => appendTerminalLog("🎤 AUDIO CALIBRATION TRIGGERED")}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-900 bg-slate-950 hover:bg-slate-900/30 text-slate-350 transition"
          >
            <Mic className="h-6 w-6 mb-2 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase">Calibrate Microphone</span>
          </button>
          <div className="space-y-1">
            <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-widest">Presets</span>
            {VOICE_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => { setInputText(p.text); setSelectedLanguage(p.lang); triggerAnalysis(p.text); appendTerminalLog(`🎤 LOAD PRESET: ${p.label}`); }}
                className="w-full text-left p-2 rounded-lg border border-slate-900 bg-slate-950 text-[9px] font-bold text-slate-350 truncate hover:border-slate-800"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "image" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
          <div className="p-4 border border-dashed border-slate-850 bg-slate-950 hover:bg-slate-900/20 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer select-none">
            <Layers className="h-5 w-5 text-slate-600 mb-2" />
            <span className="text-[9px] font-bold text-slate-500 uppercase">Drag PNG image manifest</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-widest">OCR Scans</span>
            {IMAGE_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => { setInputText(p.extractedText); triggerAnalysis(p.extractedText); appendTerminalLog(`📸 OCR SCAN: ${p.fileName}`); }}
                className="w-full text-left p-2 border border-slate-900 bg-slate-950 hover:border-slate-800 rounded-lg text-[9px] font-bold leading-tight block"
              >
                <span className="text-indigo-400 block truncate">{p.title}</span>
                <span className="text-[8px] text-slate-500 font-mono block">{p.fileName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-900/60">
        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
          <span className="font-semibold">Locale:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-950 border border-slate-850 text-slate-300 rounded px-2 py-1 font-semibold"
          >
            <option value="en">English (US)</option>
            <option value="ta">Tamil (தமிழ்)</option>
            <option value="si">Sinhala (සිංහල)</option>
          </select>
        </div>
        <Button onClick={() => triggerAnalysis()} disabled={isAnalyzing} variant="primary" size="sm">
          {isAnalyzing ? <RefreshCw className="h-3 w-3 animate-spin mr-1.5" /> : <Play className="h-3 w-3 mr-1.5" />}
          Launch Scanning Sequence
        </Button>
      </div>
    </div>
  );
}
