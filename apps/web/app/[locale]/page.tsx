"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { initSpeechRecognition, toggleListening, speakText } from "./voice-helper";
import { useRouter, usePathname } from "next/navigation";
import { Button, Card, Textarea, Badge } from "@perception-mapper/ui";
import {
  Sparkles, Mic,
  Globe,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Download,
  Key,
  Layers,
  CheckCircle,
  HelpCircle,
  Lock,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "../clerk-compat";

export default function Dashboard() {
  const t = useTranslations("Index");
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // State management
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"free" | "pro" | "team">("pro");
  const [languageMode, setLanguageMode] = useState<"auto" | "en" | "ta" | "si">("auto");
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // Custom Bias Rule states (Team Plan)
  const [customPattern, setCustomPattern] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customRephrase, setCustomRephrase] = useState("");
  const [rulesStatus, setRulesStatus] = useState("");

  // Switch locale helper
  const handleLocaleChange = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale; // Replace current locale
    router.push(segments.join("/"));
  };

  // High-fidelity PDF Export Generator (Safe procedural string building)
  const handlePdfExport = () => {
    if (!analysisResult) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let tonesHtml = "";
    if (analysisResult.tones && Array.isArray(analysisResult.tones)) {
      analysisResult.tones.forEach((t: any) => {
        tonesHtml += "<div style=\"margin-bottom: 14px; font-size: 13px;\">" +
          "<strong>" + t.name + "</strong> - " + t.score + "%" +
          "<div class=\"bar-container\"><div class=\"bar" + (t.name === "Connection Error" ? "-error" : "") + "\" style=\"width: " + t.score + "%;\"></div></div></div>";
      });
    }

    let biasesHtml = "";
    if (analysisResult.biases && Array.isArray(analysisResult.biases)) {
      analysisResult.biases.forEach((b: any) => {
        biasesHtml += "<div class=\"bias-card\"><div class=\"quote\">\"" + b.quote + "\"</div>" +
          "<div style=\"margin-top: 6px; font-size: 12px;\"><strong>Classification:</strong> " + b.type + "</div>" +
          "<div style=\"font-size: 11px; color: #64748b; margin-top: 2px;\">" + b.description + "</div>" +
          "<div class=\"rephrase\">Suggested Objective Alternative: " + b.rephrase + "</div></div>";
      });
    }

    printWindow.document.write(
      "<html><head><title>Perception Report</title><style>" +
      "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; background-color: #ffffff; }" +
      "h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-weight: 800; font-size: 26px; letter-spacing: -0.05em; }" +
      ".meta { display: flex; gap: 40px; margin-bottom: 30px; font-weight: 600; background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 14px; border: 1px solid #e2e8f0; }" +
      ".section { margin-bottom: 30px; }" +
      "h3 { color: #0f172a; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; }" +
      ".bar-container { background: #f1f5f9; border-radius: 9999px; height: 8px; width: 100%; margin-top: 5px; }" +
      ".bar { background: linear-gradient(90deg, #4f46e5, #ec4899); height: 8px; border-radius: 9999px; }" +
      ".bar-error { background: #ef4444; }" +
      ".bias-card { background: #fff1f2; border: 1px solid #ffe4e6; padding: 15px; border-radius: 8px; margin-bottom: 15px; }" +
      ".quote { font-style: italic; color: #be123c; font-weight: 500; }" +
      ".rephrase { font-weight: 600; color: #047857; margin-top: 10px; font-size: 13px; }" +
      "</style></head><body>" +
      "<h1>Perception Mapper AI - Analysis Report</h1>" +
      "<div class=\"meta\">" +
      "<div>Language Mode: " + (analysisResult.language || "Auto") + "</div>" +
      "<div>Bias Index: " + (analysisResult.scores ? analysisResult.scores.biasIndex : 0) + "%</div>" +
      "<div>Objectivity Index: " + (analysisResult.scores ? analysisResult.scores.objectivity : 100) + "%</div>" +
      "</div>" +
      "<div class=\"section\"><h3>Tone Breakdown Analysis</h3>" + tonesHtml + "</div>" +
      "<div class=\"section\"><h3>Identified Cognitive Biases & Alternative Rephrasings</h3>" + biasesHtml + "</div>" +
      "<" + "script>window.onload = function() { window.print(); window.close(); }</" + "script>" +
      "</body></html>"
    );
    printWindow.document.close();
  };

  // Live Analysis API connection to NestJS Gateway
  useEffect(() => {
    // Initialize speech recognition with callback to update text input
    initSpeechRecognition((result) => {
      // Append recognized speech to existing text
      setText((prev) => (prev ? prev + " " + result.transcript : result.transcript));
    });
  }, []);

  const handleVoiceToggle = () => {
    const newState = toggleListening((result) => {
      setText((prev) => (prev ? prev + " " + result.transcript : result.transcript));
    });
    setIsVoiceActive(newState);
  };

  const triggerAnalysis = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          language: languageMode,
          tier: selectedTier,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      // Connection Error Fallback
      setAnalysisResult({
        language: "Offline Mode",
        scores: {
          sentiment: 50,
          objectivity: 50,
          biasIndex: 0,
        },
        tones: [
          { name: "Connection Error", score: 100, color: "from-red-500 to-orange-500" },
        ],
        biases: [
          {
            quote: text.slice(0, Math.min(text.length, 60)) + "...",
            type: "Offline Alert",
            description: "Unable to establish connection to the NestJS Gateway API on port 3001.",
            rephrase: "Start the gateway server locally via 'npx pnpm run dev' to inspect live analysis metrics.",
          },
        ],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 font-sans">
      {/* Ambient Radial Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full bg-slate-950/60 backdrop-blur-xl border-b border-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
              {t("title")}
            </h1>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase">
              NLP Perception Engine
            </span>
          </div>
        </div>

        {/* Global Control Bar */}
        <div className="flex items-center space-x-4">
          {/* i18n Language Toggler */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => handleLocaleChange("en")}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                pathname.startsWith("/en") ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLocaleChange("ta")}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                pathname.startsWith("/ta") ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => handleLocaleChange("si")}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                pathname.startsWith("/si") ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              සිංහල
            </button>
          </div>

          {/* Pricing Tier Selector (Mock State Switching) */}
          <div className="hidden md:flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setSelectedTier("free")}
              className={`px-3 py-1 rounded transition-colors ${
                selectedTier === "free" ? "bg-indigo-950 text-indigo-300 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setSelectedTier("pro")}
              className={`px-3 py-1 rounded transition-colors ${
                selectedTier === "pro" ? "bg-indigo-950 text-indigo-300 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Pro
            </button>
            <button
              onClick={() => setSelectedTier("team")}
              className={`px-3 py-1 rounded transition-colors ${
                selectedTier === "team" ? "bg-indigo-950 text-indigo-300 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Team
            </button>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* Clerk Session Controls */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition duration-300 shadow shadow-indigo-500/10">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      {/* Main Layout Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 min-h-[600px]">
        {/* Glassmorphic Lock Overlay for Signed-Out Users */}
        {!isSignedIn && (
          <div className="absolute inset-x-6 top-8 bottom-8 z-20 backdrop-blur-md bg-slate-950/60 rounded-3xl flex flex-col justify-center items-center p-8 text-center border border-slate-900 shadow-2xl min-h-[500px]">
            <div className="relative mb-6">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 blur-lg animate-pulse" />
              <div className="relative bg-slate-950 p-5 rounded-full border border-slate-800 flex items-center justify-center">
                <Lock className="h-8 w-8 text-indigo-400 animate-bounce" />
              </div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
              Workspace Locked
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Verify your session credentials to unlock standard NLP tone parsing, multilingual cognitive bias detection, and custom rule builders.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <SignInButton>
                <button className="px-8 py-3.5 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition duration-300 shadow-lg shadow-indigo-500/20 hover:scale-[1.01] cursor-pointer">
                  Sign In to Account
                </button>
              </SignInButton>
              <button
                onClick={() => {
                  const segments = pathname.split("/");
                  const locale = segments[1] || "en";
                  router.push(`/${locale}/sign-up`);
                }}
                className="px-8 py-3.5 text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl hover:border-slate-700 transition duration-300 cursor-pointer"
              >
                Register Free Setup
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Grid Workspace */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 transition-all duration-500 ${!isSignedIn ? "blur-md pointer-events-none select-none opacity-40" : ""}`}>
          
          {/* Left Side: Analyzer Workspace */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Welcome Card */}
          <div className="p-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20">
            <div className="bg-slate-950 p-6 rounded-[14px]">
              <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">
                {t("subtitle")}
              </h2>
              <p className="text-slate-400 text-sm">
                Unlock professional-grade analysis. Compare cognitive biases side-by-side in English, Sinhala, and Tamil.
              </p>
            </div>
          </div>

          {/* Interactive Text Input Panel */}
          <Card className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold tracking-wide text-indigo-400 uppercase">
                Input Workspace
              </label>
              
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-500">Analysis Engine:</span>
                <Badge variant={selectedTier === "free" ? "neutral" : "success"}>
                  {selectedTier === "free" ? "Standard Rules" : selectedTier === "pro" ? "Pro deep models" : "Team Custom BERT"}
                </Badge>
              </div>
            </div>

            {/* Input Text Area */}
            <div className="relative flex-1 flex flex-col min-h-[300px]">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("placeholder")}
                className="flex-1 min-h-[280px] p-4 text-base focus:ring-indigo-500/40 border-slate-800"
              />
              {/* Voice toggle button */}
              <Button
                variant="secondary"
                className="absolute bottom-2 right-2 h-8 w-8 p-0 flex items-center justify-center"
                onClick={handleVoiceToggle}
              >
                <Mic className={isVoiceActive ? "h-4 w-4 text-indigo-500" : "h-4 w-4 text-slate-400"} />
              </Button>
              
              {/* Floating word count */}
              <div className="absolute bottom-3 right-14 text-xs text-slate-500 font-mono">
                {text.length} characters | {text.split(/\s+/).filter(Boolean).length} words
              </div>
            </div>

            {/* Additional Engine controls */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Analytical Language Model
                </label>
                <select
                  value={languageMode}
                  onChange={(e: any) => setLanguageMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="auto">Auto-Detect Language</option>
                  <option value="en">English (US/UK)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="si">Sinhala (සිංහල)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Tone Depth Profile
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
                  {["Standard", "Nuanced", "Academic"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className="px-2 py-1 text-[10px] font-semibold text-slate-400 hover:text-slate-200 rounded"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Trigger Button */}
            <Button
              onClick={triggerAnalysis}
              disabled={isAnalyzing || !text.trim()}
              variant="primary"
              className="mt-6 py-4 shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  <span>Calibrating Neural Layers...</span>
                </>
              ) : (
                <>
                  <span>{t("analyzeButton")}</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </Card>

          {/* Custom Bias Rule Editor (Team Plan Exclusive) */}
          {selectedTier === "team" && (
            <Card className="mt-6 border-indigo-500/20 bg-indigo-950/5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold tracking-wider text-indigo-400 uppercase flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Custom Bias Rule Editor
                </h3>
                <Badge variant="info">Team Feature</Badge>
              </div>
              
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                    Rule Match Pattern (Regex/Word)
                  </label>
                  <input
                    type="text"
                    value={customPattern}
                    onChange={(e) => setCustomPattern(e.target.value)}
                    placeholder="e.g. clearly|obviously"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                      Bias Classification Category
                    </label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Confirmation Bias"
                      className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                      Objective Rephrase Match
                    </label>
                    <input
                      type="text"
                      value={customRephrase}
                      onChange={(e) => setCustomRephrase(e.target.value)}
                      placeholder="e.g. evidence suggests"
                      className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <Button
                  onClick={async () => {
                    if (!customPattern || !customCategory || !customRephrase) return;
                    setRulesStatus("syncing");
                    try {
                      const res = await fetch("http://localhost:3001/api/rules/custom", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ pattern: customPattern, category: customCategory, rephrase: customRephrase })
                      });
                      if (res.ok) {
                        setRulesStatus("success");
                        setCustomPattern("");
                        setCustomCategory("");
                        setCustomRephrase("");
                        setTimeout(() => setRulesStatus(""), 3000);
                      }
                    } catch (e) {
                      setRulesStatus("error");
                      setTimeout(() => setRulesStatus(""), 3000);
                    }
                  }}
                  variant="secondary"
                  className="w-full text-xs font-semibold py-2.5 animate-pulse"
                >
                  {rulesStatus === "syncing" ? "Syncing with cloud..." : rulesStatus === "success" ? "Rule added successfully!" : "Add Custom Parse Rule"}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Right Side: Dynamic Visual Analytics Reporting */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Analysis Result Status/Header */}
          {!analysisResult ? (
            <Card className="flex flex-col justify-center items-center py-16 text-center border-dashed border-slate-800 h-full">
              <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-400">
                <Globe className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="font-semibold text-slate-200 mb-1">Awaiting Text Entry</h3>
              <p className="text-slate-500 text-xs max-w-[280px] mx-auto">
                Paste content on the workspace panel and initiate analysis to inspect cognitive biases, language patterns, and tone breakdowns.
              </p>
            </Card>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4" hoverEffect={false}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {t("detectedLanguage")}
                    </span>
                    <Badge variant="info">{analysisResult.language}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-white tracking-tight">
                    {analysisResult.language}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Checked via rule-set tokenizers</p>
                </Card>

                <Card className="p-4" hoverEffect={false}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Bias Index
                    </span>
                    <Badge variant={analysisResult.scores.biasIndex > 50 ? "error" : "success"}>
                      {analysisResult.scores.biasIndex > 50 ? "Biased" : "Objective"}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-white tracking-tight">
                    {analysisResult.scores.biasIndex}%
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Cognitive distortions matched</p>
                </Card>
              </div>

              {/* Tone Breakdown Progress Meters */}
              <Card hoverEffect={false}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold tracking-wider text-indigo-400 uppercase flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {t("tone")}
                  </h3>
                  <Badge variant="neutral">Nuanced Engine</Badge>
                </div>

                <div className="space-y-4">
                  {analysisResult.tones.map((t: any) => (
                    <div key={t.name}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-300">{t.name}</span>
                        <span className="text-indigo-300">{t.score}%</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-900">
                        <div
                          className={`bg-gradient-to-r ${t.color} h-2.5 rounded-full transition-all duration-1000`}
                          style={{ width: `${t.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Bias highlights and suggestions */}
              <Card hoverEffect={false}>
                {/* Speak analysis button */}
                {analysisResult && (
                  <Button
                    variant="ghost"
                    className="mb-4 w-full flex items-center justify-center text-xs"
                    onClick={() => {
                      const summary = `Detected language ${analysisResult.language}. Bias index ${analysisResult.scores.biasIndex} percent. ${analysisResult.biases.length} bias highlights detected.`;
                      speakText(summary, "en-US");
                    }}
                  >
                    <Mic className="h-4 w-4 mr-1" />
                    Listen to Summary
                  </Button>
                )}

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold tracking-wider text-indigo-400 uppercase flex items-center">
                    <ShieldAlert className="h-4 w-4 mr-2 text-pink-500" />
                    {t("bias")}
                  </h3>
                  <Badge variant="error">Distortion Flagged</Badge>
                </div>

                {analysisResult.biases.map((bias: any, idx: number) => (
                  <div key={idx} className="space-y-3">
                    <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl">
                      <p className="text-xs text-pink-400 italic">
                        &ldquo;{bias.quote}&rdquo;
                      </p>
                    </div>

                    <div className="text-xs space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                        <span>Type: {bias.type}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        {bias.description}
                      </p>
                    </div>

                    {/* Rephrasing Advice */}
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold text-emerald-400 uppercase flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Suggested Objective Alternative
                        </span>
                        <Badge variant="success">Rule Engine</Badge>
                      </div>
                      <p className="text-xs text-slate-300">
                        {bias.rephrase}
                      </p>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Actions & Integration Panel */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="glass"
                  className="flex items-center justify-center space-x-2 text-xs font-semibold py-3"
                  onClick={handlePdfExport}
                >
                  <Download className="h-4 w-4" />
                  <span>PDF Export</span>
                </Button>

                <Button
                  variant="secondary"
                  className="flex items-center justify-center space-x-2 text-xs font-semibold py-3"
                  onClick={() => alert("API Configuration: Key created! (pm_key_team_pro_2026)")}
                >
                  <Key className="h-4 w-4" />
                  <span>API Integration</span>
                </Button>
              </div>

              {/* Developer Key Console (Team Plan Exclusive) */}
              {selectedTier === "team" && (
                <Card hoverEffect={false} className="border-indigo-500/20 bg-indigo-950/5">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold tracking-wider text-indigo-400 uppercase flex items-center">
                      <Key className="h-3.5 w-3.5 mr-1.5" />
                      Developer API Access
                    </h4>
                    <Badge variant="success">Active</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Authenticate automated CLI requests using your X-API-Key token.
                    </p>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono text-[10px] text-indigo-300 break-all select-all">
                      pm_key_team_pro_2026
                    </div>
                    
                    <pre className="text-[9px] text-slate-500 mt-2 font-mono leading-relaxed bg-slate-950/70 p-2.5 rounded-xl border border-slate-900 overflow-x-auto whitespace-pre select-all">
{`curl -X POST http://localhost:3001/api/analyze/developer \\
  -H "X-API-Key: pm_key_team_pro_2026" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "your custom text"}'`}
                    </pre>
                  </div>
                </Card>
              )}
            </>
          )}

          {/* Pricing info card */}
          <Card className="bg-gradient-to-tr from-slate-900 to-indigo-950/20 border-slate-800/40 p-4" hoverEffect={false}>
            <div className="flex space-x-3 items-start">
              <Layers className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-semibold text-slate-200 mb-1">
                  Active Subscription: <span className="text-indigo-400 uppercase font-bold">{selectedTier} Tier</span>
                </h4>
                <p className="text-slate-500 leading-relaxed">
                  {t("quotaWarning")}
                </p>
              </div>
            </div>
          </Card>
        </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© 2026 Perception Mapper AI. Built with Turborepo, Next.js 14, NestJS, and FastAPI.</p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Security Protocol</span>
            <span className="hover:text-slate-400 cursor-pointer">API Agreement</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
