"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { speakText } from "../voice-helper";
import VoiceInputButton from "./VoiceInputButton";
import { useRouter, usePathname } from "next/navigation";
import { Button, Card, Textarea, Badge } from "@perception-mapper/ui";
import {
  Sparkles,
  Mic,
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
  ChevronDown,
  Languages,
  Menu,
  X,
  Zap,
  Server,
  Mail,
  Shield,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "../clerk-compat";
import AnalyticsView from "./AnalyticsView";
import DocsView from "./DocsView";
import GatewayView from "./GatewayView";

export default function Dashboard() {
  const t = useTranslations("Index");
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, user, setRole } = useAuth();
  
  // Track mounting to avoid SSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Dashboard workspace states
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"free" | "pro" | "team">("pro");
  const [languageMode, setLanguageMode] = useState<"auto" | "en" | "ta" | "si">("auto");
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<"home" | "dashboard" | "analytics" | "docs" | "gateway">("home");

  // Custom Bias Rule states (Team Plan)
  const [customPattern, setCustomPattern] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customRephrase, setCustomRephrase] = useState("");
  const [rulesStatus, setRulesStatus] = useState("");

  // Interactive AI Simulator Sandbox states (SaaS Landing Page)
  const [sandboxText, setSandboxText] = useState("This is clearly a massive and obvious exaggeration, but nobody cares.");
  const [sandboxLang, setSandboxLang] = useState("auto");
  const [sandboxTier, setSandboxTier] = useState<"free" | "pro" | "team">("pro");
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any | null>(null);

  // Mobile navigation hamburger toggle (SaaS Landing Page)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-redirect to dashboard if signed in and landing on "home" tab initially
  useEffect(() => {
    if (mounted && isSignedIn && currentTab === "home") {
      setCurrentTab("dashboard");
    }
  }, [mounted, isSignedIn]);

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
      
      // Track analysis log event in database
      await fetch("http://localhost:3001/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity: "ANALYSIS", details: `Analyzed text snippet (${text.length} chars) via client workspace.` })
      }).catch(() => {});

    } catch (error) {
      // Connection Error Fallback
      setAnalysisResult({
        language: "Offline Mode",
        scores: {
          sentiment: 50,
          objectivity: 50,
          biasIndex: 35,
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

  // Run mock analysis for SaaS Landing Page Sandbox Simulator
  const handleSandboxDemo = () => {
    if (!sandboxText.trim()) return;
    setSandboxLoading(true);
    setSandboxResult(null);

    setTimeout(() => {
      setSandboxResult({
        language: "English (Detected)",
        scores: {
          biasIndex: 68,
          objectivity: 32,
        },
        tones: [
          { name: "Assertive Tone", score: 74, color: "from-indigo-500 to-purple-500" },
          { name: "Objective Neutrality", score: 32, color: "from-slate-600 to-slate-400" },
          { name: "Hyperbolic Distortion", score: 82, color: "from-pink-500 to-red-500" },
        ],
        biases: [
          {
            quote: "clearly a massive and obvious exaggeration",
            type: "Hyperbolic Exaggeration / Emotional Distortion",
            description: "Uses highly dramatic modifiers ('clearly', 'massive', 'obvious') to present subjective sentiment as an absolute, objective fact, bypassing cognitive logic.",
            rephrase: "Based on active indicators, there appears to be a notable structural mismatch in these details.",
          }
        ]
      });
      setSandboxLoading(false);
    }, 900);
  };

  // Standard smooth scrolling handler
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) {
    return (
      <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />
        <div className="relative flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 blur animate-pulse" />
            <div className="relative bg-slate-950 p-4 rounded-full border border-slate-800">
              <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase animate-pulse">
            Calibrating Perception Mapper AI...
          </span>
        </div>
      </div>
    );
  }

  // ------------------ SAAS LANDING PAGE RENDER (SIGNED OUT) ------------------
  if (!isSignedIn && currentTab === "home") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden relative scroll-smooth">
        {/* Ambient Radial Glowing Blobs */}
        <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute top-[30%] right-[-15%] w-[50%] h-[50%] rounded-full bg-pink-500/5 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-600/5 blur-[140px] pointer-events-none" />

        {/* Sticky Header / Navbar */}
        <header className="sticky top-0 z-50 w-full bg-slate-950/75 backdrop-blur-xl border-b border-slate-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => scrollToSection("home")}>
            <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/10 transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-md font-extrabold tracking-tight text-white leading-none">
                Perception Mapper AI
              </h1>
              <span className="text-[9px] text-indigo-400 font-bold tracking-wider uppercase mt-1">
                NLP Perception Engine
              </span>
            </div>
          </div>

          {/* Desktop Navigation Link anchors */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold text-slate-400">
            <button onClick={() => scrollToSection("home")} className="hover:text-white transition">Home</button>
            <button onClick={() => scrollToSection("details")} className="hover:text-white transition">AI Details</button>
            <button onClick={() => scrollToSection("features")} className="hover:text-white transition">Features</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-white transition">Pricing Plans</button>
            <button onClick={() => scrollToSection("sandbox")} className="hover:text-indigo-400 text-indigo-500 transition flex items-center gap-1">
              <Zap className="h-3 w-3" /> AI Sandbox
            </button>
          </nav>

          {/* Login / Auth controls */}
          <div className="hidden md:flex items-center space-x-3">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition shadow shadow-indigo-500/10 hover:scale-[1.02]">
                Authenticate Workspace
              </button>
            </SignInButton>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button className="md:hidden text-slate-400 hover:text-white transition" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Mobile responsive popover menu */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-slate-950 border-b border-slate-900 p-6 flex flex-col space-y-4 shadow-2xl z-50 animate-in slide-in-from-top-4 duration-200">
              <button onClick={() => scrollToSection("home")} className="text-left text-sm font-semibold text-slate-300 hover:text-white transition">Home</button>
              <button onClick={() => scrollToSection("details")} className="text-left text-sm font-semibold text-slate-300 hover:text-white transition">AI Details</button>
              <button onClick={() => scrollToSection("features")} className="text-left text-sm font-semibold text-slate-300 hover:text-white transition">Features</button>
              <button onClick={() => scrollToSection("pricing")} className="text-left text-sm font-semibold text-slate-300 hover:text-white transition">Pricing Plans</button>
              <button onClick={() => scrollToSection("sandbox")} className="text-left text-sm font-semibold text-indigo-400 flex items-center gap-1.5"><Zap className="h-4 w-4" /> AI Sandbox</button>
              <div className="h-px bg-slate-900 my-2" />
              <SignInButton mode="modal">
                <button className="w-full py-3 text-center text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition shadow shadow-indigo-500/10">
                  Authenticate Workspace
                </button>
              </SignInButton>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section id="home" className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
          {/* Tagline badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Generation NLP Analytics</span>
          </div>

          {/* Large AI Headline */}
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] mb-6">
            Unveil the Hidden Dimensions of{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Perception
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Deploy enterprise-grade language models to analyze tone dynamics, map cognitive distortions, and configure custom rule builders side-by-side in English, Sinhala, and Tamil.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto px-8 py-4 text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/25 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer">
                <span>Deploy Engine Free</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </SignInButton>
            <button onClick={() => scrollToSection("sandbox")} className="w-full sm:w-auto px-8 py-4 text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl hover:border-slate-700 transition flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer">
              <Zap className="h-4 w-4 text-indigo-400 animate-pulse" />
              <span>Explore AI Sandbox</span>
            </button>
          </div>
        </section>

        {/* Brand visual dashboard preview placeholder image */}
        <section className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
          <div className="p-1.5 rounded-3xl bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent border border-slate-900/60 shadow-2xl">
            <div className="bg-slate-950/80 backdrop-blur-2xl rounded-[20px] overflow-hidden border border-slate-800/60 relative">
              {/* Fake dashboard shell */}
              <div className="flex items-center space-x-2 border-b border-slate-900/80 px-4 py-3 bg-slate-950">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="text-[10px] text-slate-600 font-mono pl-4">perception-mapper-workspace-console.ai</span>
              </div>
              <div className="p-8 aspect-[16/9] flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
                
                <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl max-w-md relative z-10">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2">Workspace Locked Simulator</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                    Authenticating triggers our micro-engine sidecars on port 3001, providing live database heatmaps, API gateway quota key provisioners, and safety rate limiters.
                  </p>
                  <SignInButton mode="modal">
                    <button className="px-5 py-2.5 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all hover:scale-[1.01]">
                      Unlock Workspace Console
                    </button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Details Section */}
        <section id="details" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Unpack Tone Dynamics & Cognitive Mappings
            </h3>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Explore the five custom parser modules operating dynamically within our Python NLP sidecar and NestJS core gateway.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tone Analysis */}
            <Card className="p-6 bg-slate-950/40 border-slate-900 flex flex-col space-y-4 hover:border-indigo-500/20 transition-all duration-300">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Tone Analysis</h4>
              <p className="text-xs text-slate-400 leading-relaxed flex-grow">
                Examines text strings to compile relative emotional indicators, mapping neutral, assertive, scholarly, and empathetic speech weights.
              </p>
            </Card>

            {/* Bias Detection */}
            <Card className="p-6 bg-slate-950/40 border-slate-900 flex flex-col space-y-4 hover:border-pink-500/20 transition-all duration-300">
              <div className="p-3 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl w-fit">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Bias Flagging</h4>
              <p className="text-xs text-slate-400 leading-relaxed flex-grow">
                Targeted identification of structural cognitive distortions, highlighting confirmation bias, exaggeration, and emotional reasoning.
              </p>
            </Card>

            {/* Voice AI */}
            <Card className="p-6 bg-slate-950/40 border-slate-900 flex flex-col space-y-4 hover:border-indigo-500/20 transition-all duration-300">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit">
                <Mic className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Speech Synthesis</h4>
              <p className="text-xs text-slate-400 leading-relaxed flex-grow">
                Integrated Web Speech API abstracts vendor modules, synthesizing summary reports procedurally into high-quality spoken voice.
              </p>
            </Card>

            {/* Image Analysis */}
            <Card className="p-6 bg-slate-950/40 border-slate-900 flex flex-col space-y-4 hover:border-pink-500/20 transition-all duration-300">
              <div className="p-3 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl w-fit">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Perception PDF Audits</h4>
              <p className="text-xs text-slate-400 leading-relaxed flex-grow">
                Safely parses uploaded documents and scanned perception papers, matching textual parameters against custom category tables.
              </p>
            </Card>

            {/* Real-time NLP Engine */}
            <Card className="p-6 bg-slate-950/40 border-slate-900 flex flex-col space-y-4 hover:border-indigo-500/20 transition-all duration-300">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Real-Time Core Sidecar</h4>
              <p className="text-xs text-slate-400 leading-relaxed flex-grow">
                Custom-orchestrated sidecar threads executing on FastAPI, achieving sub-millisecond local latency on BERT inference checks.
              </p>
            </Card>

            {/* Multilingual Support */}
            <Card className="p-6 bg-slate-950/40 border-slate-900 flex flex-col space-y-4 hover:border-pink-500/20 transition-all duration-300">
              <div className="p-3 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl w-fit">
                <Globe className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Locale Synchronization</h4>
              <p className="text-xs text-slate-400 leading-relaxed flex-grow">
                Full dynamic support for next-intl mappings, displaying side-by-side linguistic indicators for English, Tamil, and Sinhala text blocks.
              </p>
            </Card>
          </div>
        </section>

        {/* Features Bento Grid Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Engineered for Enterprise Stability
            </h3>
            <p className="text-slate-400 text-sm mt-3">
              Unlock robust access controls, rate-limiting sandbox gateways, and low-latency auditfeeds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-slate-950/40 border-slate-900 hover:border-indigo-500/15 transition duration-300 md:col-span-2" hoverEffect={false}>
              <div className="flex items-center space-x-3 mb-3">
                <Zap className="h-5 w-5 text-indigo-400 shrink-0" />
                <h4 className="text-base font-bold text-white">Sub-Millisecond Inference Latency</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                Locally hosted models avoid slow round-trip cloud queries, achieving instantaneous analysis of text and speech structures. Verified logs track system speeds, memory consumption, and active connections.
              </p>
            </Card>

            <Card className="p-6 bg-slate-950/40 border-slate-900 hover:border-pink-500/15 transition duration-300" hoverEffect={false}>
              <div className="flex items-center space-x-3 mb-3">
                <Globe className="h-5 w-5 text-pink-400 shrink-0" />
                <h4 className="text-base font-bold text-white">Tri-Locale Sync</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full locale translation models executing dynamically via standard Next.js App Router rules.
              </p>
            </Card>

            <Card className="p-6 bg-slate-950/40 border-slate-900 hover:border-pink-500/15 transition duration-300" hoverEffect={false}>
              <div className="flex items-center space-x-3 mb-3">
                <Key className="h-5 w-5 text-pink-400 shrink-0" />
                <h4 className="text-base font-bold text-white">API Token Gateways</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate private tokens inside the API Gateway module, configured to pass sliding Redis rate-limiting rules automatically.
              </p>
            </Card>

            <Card className="p-6 bg-slate-950/40 border-slate-900 hover:border-indigo-500/15 transition duration-300 md:col-span-2" hoverEffect={false}>
              <div className="flex items-center space-x-3 mb-3">
                <Server className="h-5 w-5 text-indigo-400 shrink-0" />
                <h4 className="text-base font-bold text-white">Deep PostgreSQL Security Auditing</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                System activities (logins, analysis, policy shifts) are recorded in the security audit ledger feed. Administrators can search audit details, evaluate status parameters, and export logs to formatted spreadsheets.
              </p>
            </Card>
          </div>
        </section>

        {/* Interactive AI Sandbox Simulator */}
        <section id="sandbox" className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-900 relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              Interactive AI Sandbox Simulator
            </h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Test drive our core linguistic parser anonymously. Type any subjective, hyperbolic text block to inspect detected indicators in real-time.
            </p>
          </div>

          <Card className="p-6 bg-slate-950/60 border-slate-900" hoverEffect={false}>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Sandbox Input Workspace</label>
                <textarea
                  value={sandboxText}
                  onChange={(e) => setSandboxText(e.target.value)}
                  placeholder="Paste any article or script here..."
                  className="w-full min-h-[100px] bg-slate-950 border border-slate-900 focus:border-indigo-500/80 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 outline-none transition-all resize-y"
                />
              </div>

              {/* Selector menus */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Analyzer Locale</label>
                  <select
                    value={sandboxLang}
                    onChange={(e) => setSandboxLang(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-300 outline-none"
                  >
                    <option value="auto">Auto-Detect Language</option>
                    <option value="en">English (US)</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                    <option value="si">Sinhala (සිංහල)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Subscription Tier Level</label>
                  <select
                    value={sandboxTier}
                    onChange={(e: any) => setSandboxTier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-300 outline-none"
                  >
                    <option value="free">Free Trial Tier</option>
                    <option value="pro">Pro deep models (Dynamic)</option>
                    <option value="team">Team custom BERT</option>
                  </select>
                </div>
              </div>

              {/* Trigger */}
              <button
                onClick={handleSandboxDemo}
                disabled={sandboxLoading || !sandboxText.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {sandboxLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-1.5" />
                    <span>Calibrating Neural Layers...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Sandbox Query</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </>
                )}
              </button>

              {/* Sandbox results presentation */}
              {sandboxResult && (
                <div className="mt-6 border-t border-slate-900 pt-6 space-y-5 animate-in fade-in duration-300">
                  {/* Summary badges */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl">
                      <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider block mb-1">Detected Language</span>
                      <span className="text-sm font-bold text-white">{sandboxResult.language}</span>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl">
                      <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider block mb-1">Bias Index Score</span>
                      <span className="text-sm font-bold text-pink-400 font-mono">{sandboxResult.scores.biasIndex}%</span>
                    </div>
                  </div>

                  {/* Tones breakdown */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Estimated Tone Breakdown</span>
                    {sandboxResult.tones.map((t: any) => (
                      <div key={t.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">{t.name}</span>
                          <span className="text-indigo-400">{t.score}%</span>
                        </div>
                        <div className="w-full bg-slate-950 border border-slate-900 h-2 rounded-full overflow-hidden">
                          <div className={`bg-gradient-to-r ${t.color} h-2 rounded-full`} style={{ width: `${t.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl space-y-2">
                    <span className="text-[9px] text-pink-500 font-bold uppercase tracking-wider block">Linguistic Bias Flagged</span>
                    <p className="text-xs text-pink-400 italic font-medium">&ldquo;{sandboxResult.biases[0].quote}&rdquo;</p>
                    <div className="text-[11px] text-slate-400 mt-2">
                      <strong>Classification:</strong> {sandboxResult.biases[0].type}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{sandboxResult.biases[0].description}</p>
                    
                    {/* Rephrasing Advice */}
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-1.5 mt-2">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">Suggested Objective Alternative</span>
                      <p className="text-xs text-slate-300">{sandboxResult.biases[0].rephrase}</p>
                    </div>
                  </div>

                  {/* CTA invitation */}
                  <div className="text-center pt-2">
                    <SignInButton mode="modal">
                      <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
                        Authenticate account to customize rephrase rules and save audits &rarr;
                      </button>
                    </SignInButton>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Pricing Plans Section */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Flexible Tiers for Growing Workspace Teams
            </h3>
            <p className="text-slate-400 text-sm mt-3">
              Compare feature allocations and elevate your plan instantly in your workspace dropdown.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="p-6 bg-slate-950/40 border-slate-900 flex flex-col justify-between hover:border-slate-800 transition duration-300" hoverEffect={false}>
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Free Trial</span>
                <h4 className="text-2xl font-extrabold text-white tracking-tight mb-4">$0</h4>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">Essential rules testing for anonymous developers.</p>
                <div className="h-px bg-slate-900 mb-6" />
                <ul className="space-y-3.5 text-xs text-slate-400">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> 10 Analyses / Month</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> Standard NLP rules</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> English US locale</li>
                  <li className="flex items-center opacity-40"><CheckCircle className="h-4 w-4 text-slate-500 mr-2 shrink-0" /> Web speech synthesis</li>
                  <li className="flex items-center opacity-40"><CheckCircle className="h-4 w-4 text-slate-500 mr-2 shrink-0" /> Custom rule editor</li>
                </ul>
              </div>
              <SignInButton mode="modal">
                <button className="w-full mt-8 py-3 text-xs font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer">
                  Authenticate Account
                </button>
              </SignInButton>
            </Card>

            {/* Pro Plan (Highly Recommended) */}
            <div className="p-1 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-2xl relative transition hover:scale-[1.01] duration-300">
              {/* Highlight ribbon */}
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-[9px] uppercase tracking-wider shadow">
                Most Popular
              </div>

              <div className="bg-slate-950 p-6 rounded-[22px] h-full flex flex-col justify-between">
                <div>
                  <span className="text-indigo-400 text-xs font-extrabold uppercase tracking-widest block mb-2">Professional</span>
                  <h4 className="text-2xl font-extrabold text-white tracking-tight mb-4">$29<span className="text-xs text-slate-500 font-bold"> / month</span></h4>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">Deep dynamic NLP models for individual developers and creators.</p>
                  <div className="h-px bg-slate-900 mb-6" />
                  <ul className="space-y-3.5 text-xs text-slate-300">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> 150 Analyses / Month</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> Pro deep models</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> English, Sinhala, Tamil locales</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> Web speech voice helper</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> Generate 1 Gateway API Key</li>
                  </ul>
                </div>
                <SignInButton mode="modal">
                  <button className="w-full mt-8 py-3.5 text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/20">
                    Get Started with Pro
                  </button>
                </SignInButton>
              </div>
            </div>

            {/* Team Plan */}
            <Card className="p-6 bg-slate-950/40 border-slate-900 flex flex-col justify-between hover:border-slate-800 transition duration-300" hoverEffect={false}>
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Enterprise Team</span>
                <h4 className="text-2xl font-extrabold text-white tracking-tight mb-4">$99<span className="text-xs text-slate-500 font-bold"> / month</span></h4>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">Custom parser models and Webhook streams for organization squads.</p>
                <div className="h-px bg-slate-900 mb-6" />
                <ul className="space-y-3.5 text-xs text-slate-400">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> Unlimited Analyses</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> Custom trained BERT engines</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> Real-time live EventSource SSE</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> Custom Regex parse rule matching</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2 shrink-0" /> Unlimited API developer keys</li>
                </ul>
              </div>
              <SignInButton mode="modal">
                <button className="w-full mt-8 py-3 text-xs font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer">
                  Contact Sales for Team
                </button>
              </SignInButton>
            </Card>
          </div>
        </section>

        {/* Contact/Footer */}
        <footer id="footer" className="mt-16 border-t border-slate-900 bg-slate-950/80 py-16 px-6 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Logo branding */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <span className="font-extrabold text-white text-sm">Perception Mapper AI</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Pioneering professional-grade, multilingual cognitive bias and emotional tone parsing engines at scale.
              </p>
              <div className="flex space-x-3 text-slate-500 text-xs">
                <span className="hover:text-white cursor-pointer transition">Twitter</span>
                <span className="hover:text-white cursor-pointer transition">GitHub</span>
                <span className="hover:text-white cursor-pointer transition">LinkedIn</span>
              </div>
            </div>

            {/* Quick Navigation links */}
            <div className="space-y-4">
              <span className="text-[10px] text-white font-extrabold uppercase tracking-wider block">Quick Navigation</span>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><button onClick={() => scrollToSection("home")} className="hover:text-slate-300 text-left transition">Hero Workspace</button></li>
                <li><button onClick={() => scrollToSection("details")} className="hover:text-slate-300 text-left transition">AI Details</button></li>
                <li><button onClick={() => scrollToSection("features")} className="hover:text-slate-300 text-left transition">Features</button></li>
                <li><button onClick={() => scrollToSection("pricing")} className="hover:text-slate-300 text-left transition">Pricing Plans</button></li>
              </ul>
            </div>

            {/* Platform microservices */}
            <div className="space-y-4">
              <span className="text-[10px] text-white font-extrabold uppercase tracking-wider block">Tech Stack</span>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>Next.js 14 Web Router</li>
                <li>NestJS Core API Port 3001</li>
                <li>Python NLP engine Port 8000</li>
                <li>PostgreSQL database via Prisma</li>
              </ul>
            </div>

            {/* Contact details */}
            <div className="space-y-4">
              <span className="text-[10px] text-white font-extrabold uppercase tracking-wider block">Contact Sales</span>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li className="flex items-center"><Mail className="h-4 w-4 text-indigo-400 mr-2 shrink-0" /> developer@perception-mapper.ai</li>
                <li className="flex items-center"><Shield className="h-4 w-4 text-pink-400 mr-2 shrink-0" /> Enterprise SLA Shield</li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900/60 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-600 space-y-4 md:space-y-0">
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

  // ------------------ STAND-ALONE INTERACTIVE WORKSPACE (SIGNED IN) ------------------
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 font-sans">
      {/* Ambient Radial Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full bg-slate-950/70 backdrop-blur-xl border-b border-slate-900 px-6 py-3.5 flex items-center justify-between">
        {/* Left Section: Logo & Brand */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setCurrentTab("home")}>
            <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-xl shadow-lg shadow-indigo-500/10 transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-md font-bold tracking-tight text-white leading-tight">
                {t("title")}
              </h1>
              <span className="text-[9px] text-indigo-400 font-semibold tracking-wider uppercase">
                NLP Perception Engine
              </span>
            </div>
          </div>

          {/* Minimalist Center Navigation Links (Hidden on small screens) */}
          <nav className="hidden lg:flex items-center space-x-1.5 text-xs font-medium text-slate-400">
            <span className="h-4 w-px bg-slate-900 mx-2" />
            <button
              onClick={() => setCurrentTab("home")}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                currentTab === "home"
                  ? "bg-slate-900/50 text-indigo-400 border border-slate-800/40"
                  : "hover:text-slate-200 hover:bg-slate-900/30 border border-transparent"
              }`}
            >
              SaaS Landing
            </button>
            <button
              onClick={() => setCurrentTab("dashboard")}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                currentTab === "dashboard"
                  ? "bg-slate-900/50 text-indigo-400 border border-slate-800/40"
                  : "hover:text-slate-200 hover:bg-slate-900/30 border border-transparent"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab("analytics")}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                currentTab === "analytics"
                  ? "bg-slate-900/50 text-indigo-400 border border-slate-800/40"
                  : "hover:text-slate-200 hover:bg-slate-900/30 border border-transparent"
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setCurrentTab("docs")}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                currentTab === "docs"
                  ? "bg-slate-900/50 text-indigo-400 border border-slate-800/40"
                  : "hover:text-slate-200 hover:bg-slate-900/30 border border-transparent"
              }`}
            >
              Documentation
            </button>
            <button
              onClick={() => setCurrentTab("gateway")}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                currentTab === "gateway"
                  ? "bg-slate-900/50 text-indigo-400 border border-slate-800/40"
                  : "hover:text-slate-200 hover:bg-slate-900/30 border border-transparent"
              }`}
            >
              API Gateway
            </button>
            {user?.role === "ADMIN" && (
              <button
                onClick={() => {
                  const segments = pathname.split("/");
                  const locale = segments[1] || "en";
                  router.push(`/${locale}/admin`);
                }}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 border border-transparent transition duration-200"
              >
                Admin Panel
              </button>
            )}
          </nav>
        </div>

        {/* Right Section: Compact Dropdowns & Session Controls */}
        <div className="flex items-center space-x-3.5">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setLangDropdownOpen(!langDropdownOpen);
                setUserDropdownOpen(false);
              }}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl transition duration-200"
            >
              <Globe className="h-3.5 w-3.5 text-indigo-400" />
              <span>
                {pathname.startsWith("/ta") ? "தமிழ்" : pathname.startsWith("/si") ? "සිංහල" : "EN"}
              </span>
              <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {langDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-900 bg-slate-950/90 backdrop-blur-xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Select Language
                  </div>
                  <button
                    onClick={() => {
                      handleLocaleChange("en");
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors text-left mt-1 ${
                      pathname.startsWith("/en") || (!pathname.startsWith("/ta") && !pathname.startsWith("/si"))
                        ? "bg-indigo-600/10 text-indigo-400 font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <span>English</span>
                    {((pathname.startsWith("/en") || (!pathname.startsWith("/ta") && !pathname.startsWith("/si")))) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleLocaleChange("ta");
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors text-left ${
                      pathname.startsWith("/ta")
                        ? "bg-indigo-600/10 text-indigo-400 font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <span>தமிழ் (Tamil)</span>
                    {pathname.startsWith("/ta") && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleLocaleChange("si");
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors text-left ${
                      pathname.startsWith("/si")
                        ? "bg-indigo-600/10 text-indigo-400 font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <span>සිංහල (Sinhala)</span>
                    {pathname.startsWith("/si") && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="h-5 w-px bg-slate-900 hidden sm:block" />

          {/* User Profile & Plan Selection Dropdown */}
          <div className="relative">
            <SignedIn>
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center space-x-2.5 p-1 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl transition duration-200"
              >
                <img
                  src={user?.avatarUrl}
                  alt={user?.name || "User"}
                  className="w-6 h-6 rounded-full border border-indigo-500/20"
                />
                <span className="hidden sm:block max-w-[100px] truncate">
                  {user?.name || "Developer"}
                </span>
                <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-900 bg-slate-950/95 backdrop-blur-xl p-3.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Block */}
                    <div className="flex items-center space-x-3 pb-3 border-b border-slate-900">
                      <img
                        src={user?.avatarUrl}
                        alt={user?.name || "User"}
                        className="w-10 h-10 rounded-full border-2 border-indigo-500/20 shadow-lg"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-white truncate leading-tight">
                          {user?.name || "Developer"}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate mb-1">
                          developer@perception.ai
                        </span>
                        <span className="inline-flex self-start text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                          {selectedTier} Plan
                        </span>
                      </div>
                    </div>

                    {/* Subscription Quick-Switcher */}
                    <div className="py-3 border-b border-slate-900">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                        Active Workspace Tier
                      </span>
                      <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-900">
                        {(["free", "pro", "team"] as const).map((tier) => (
                          <button
                            key={tier}
                            onClick={() => setSelectedTier(tier)}
                            className={`px-1.5 py-1.5 text-[10px] font-bold rounded-lg capitalize transition-all duration-200 ${
                              selectedTier === tier
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow shadow-indigo-600/30"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                            }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Administrative Role Switcher */}
                    <div className="py-3 border-b border-slate-900">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center">
                        <span className="mr-1.5">🛡️</span> Access Control Role
                      </span>
                      <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-900">
                        {["USER", "ADMIN"].map((roleOption) => (
                          <button
                            key={roleOption}
                            onClick={async () => {
                              setRole(roleOption);
                              try {
                                await fetch("http://localhost:3001/api/user/role", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({ role: roleOption }),
                                });
                              } catch (e) {
                                console.error("Could not sync role to mock db", e);
                              }
                              if (roleOption === "ADMIN") {
                                const segments = pathname.split("/");
                                const locale = segments[1] || "en";
                                router.push(`/${locale}/admin`);
                              }
                            }}
                            className={`px-1.5 py-1.5 text-[10px] font-bold rounded-lg capitalize transition-all duration-200 ${
                              user?.role === roleOption
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow shadow-purple-600/30"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                            }`}
                          >
                            {roleOption}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Unified Session / Settings Option */}
                    <div className="pt-3 flex flex-col space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider px-1 pb-1">
                        <span>Session Management</span>
                      </div>
                      <div className="flex w-full items-center justify-center">
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition duration-300 shadow shadow-indigo-500/10">
                  <Key className="h-3 w-3" />
                  <span>Authenticate</span>
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 min-h-[600px]">
        {/* Render selected active tab */}
        {currentTab === "home" ? (
          <div className="relative min-h-[500px] flex flex-col justify-center items-center text-center p-8 border border-slate-900 bg-slate-950/40 backdrop-blur-xl rounded-3xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[90px] pointer-events-none" />
            <Sparkles className="h-10 w-10 text-indigo-400 animate-bounce mb-6" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-3">Enterprise SaaS Hub</h2>
            <p className="text-slate-400 text-sm max-w-lg mb-8 leading-relaxed">
              Explore your analytical workspaces, check API Gateway rate-limit keys, and track real-time DB SSE audit telemetry streams.
            </p>
            <div className="flex gap-4">
              <Button variant="primary" onClick={() => setCurrentTab("dashboard")} className="text-xs font-bold py-3.5 px-6">
                Go to Workspace Dashboard
              </Button>
              <Button variant="secondary" onClick={() => setCurrentTab("analytics")} className="text-xs font-bold py-3.5 px-6">
                Go to Analytics Monitor
              </Button>
            </div>
          </div>
        ) : currentTab === "dashboard" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 transition-all duration-500">
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
                  <div className="absolute bottom-2 right-2">
                    <VoiceInputButton
                      onResult={(result) => setText((prev) => (prev ? prev + " " + result.transcript : result.transcript))}
                    />
                  </div>
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
                  className="mt-6 py-4 shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center space-x-2 animate-none"
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
                      className="w-full text-xs font-semibold py-2.5"
                    >
                      {rulesStatus === "syncing" ? "Syncing with cloud..." : rulesStatus === "success" ? "Rule added successfully!" : "Add Custom Parse Rule"}
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Side: Dynamic Visual Analytics Reporting */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
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
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4" hoverEffect={false}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          {t("detectedLanguage")}
                        </span>
                        <Badge variant="info">{analysisResult.language}</Badge>
                      </div>
                      <p className="text-2xl font-bold text-white tracking-tight">{analysisResult.language}</p>
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
                      <p className="text-2xl font-bold text-white tracking-tight">{analysisResult.scores.biasIndex}%</p>
                      <p className="text-[10px] text-slate-500 mt-1">Cognitive distortions matched</p>
                    </Card>
                  </div>

                  {/* Tones breakdown */}
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

                  {/* Biases highlights */}
                  <Card hoverEffect={false}>
                    {analysisResult && (
                      <Button
                        variant="ghost"
                        className="mb-4 w-full flex items-center justify-center text-xs"
                        onClick={() => {
                          const summary = `Detected language ${analysisResult.language}. Bias index ${analysisResult.scores.biasIndex} percent. ${analysisResult.biases.length} bias highlights detected.`;
                          speakText(summary, "en-US");
                        }}
                      >
                        <Mic className="h-4 w-4 mr-1 animate-pulse" />
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
                      <div key={idx} className="space-y-3 mb-4">
                        <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl">
                          <p className="text-xs text-pink-400 italic">&ldquo;{bias.quote}&rdquo;</p>
                        </div>
                        <div className="text-xs space-y-1.5">
                          <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                            <span>Type: {bias.type}</span>
                          </div>
                          <p className="text-slate-500 text-[11px] leading-relaxed">{bias.description}</p>
                        </div>
                        
                        <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-semibold text-emerald-400 uppercase flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Suggested Objective Alternative
                            </span>
                            <Badge variant="success">Rule Engine</Badge>
                          </div>
                          <p className="text-xs text-slate-300">{bias.rephrase}</p>
                        </div>
                      </div>
                    ))}
                  </Card>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="glass" className="flex items-center justify-center space-x-2 text-xs font-semibold py-3" onClick={handlePdfExport}>
                      <Download className="h-4 w-4" />
                      <span>PDF Export</span>
                    </Button>
                    <Button variant="secondary" className="flex items-center justify-center space-x-2 text-xs font-semibold py-3" onClick={() => alert("API Configuration: Key created! (pm_key_team_pro_2026)")}>
                      <Key className="h-4 w-4" />
                      <span>API Integration</span>
                    </Button>
                  </div>

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

              {/* Subscription details */}
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
        ) : currentTab === "analytics" ? (
          <AnalyticsView selectedTier={selectedTier} />
        ) : currentTab === "docs" ? (
          <DocsView />
        ) : (
          <GatewayView />
        )}
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
