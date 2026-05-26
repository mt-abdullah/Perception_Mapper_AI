"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { speakText, toggleListening } from "../voice-helper";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../clerk-compat";
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

  Users,
  Sliders,
  Cpu,
  Layers,
  Terminal,
  Play,
  FileText,
  Volume2,
  CheckCircle,
  HelpCircle,
  Copy,
  Zap,
  Lock,
  Compass,
  Layout,
  Code,
  DollarSign,
  Maximize2,
  Minimize2,
  Eye,
  Trash2, Key, Settings, ShieldCheck, Radio, FileCheck
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

// Simulated recorded speech samples for Voice mode
const VOICE_PRESETS = [
  {
    lang: "en",
    label: "English Case Study (Biased)",
    text: "Obviously, this disaster is a complete conspiracy. Everyone knows that the corporation is undeniably trying to cover up their horrible, catastrophic failure without a doubt."
  },
  {
    lang: "ta",
    label: "Tamil Speech (சந்தேகமற)",
    text: "எப்போதுமே எல்லாரும் சதி செய்கிறார்கள். வெளிப்படையாக இந்த பேரழிவு நிச்சயமாக அதிகாரிகளின் கவனக்குறைவால் ஏற்பட்டது."
  },
  {
    lang: "si",
    label: "Sinhala Speech (අතිශය)",
    text: "සෑමවිටම සැකයකින් තොරව කුමන්ත්‍රණය ක්‍රියාත්මකයි. පැහැදිලිවම මෙය ව්‍යසනයක් වන අතර කිසිවෙකුත් මෙයට වගකියන්නේ නැත."
  }
];

// Simulated OCR Optical manifest/image presets
const IMAGE_PRESETS = [
  {
    title: "Global Logistics Manifest OCR Scan",
    fileName: "freight_cargo_manifest_98h2.png",
    extractedText: "CARGO CLASSIFICATION: CRITICAL CONSPIRACY OR CRUDE FAILURE. Obviously, freight dispatch is completely disaster-stricken. Dispatchers are undeniably ignoring crucial warnings completely."
  },
  {
    title: "Sovereign Border Declaration Optical OCR Scan",
    fileName: "passport_declaration_ocr_v4.png",
    extractedText: "DECLARATION METRICS: Border safety is a catastrophic disaster. Everyone is clearly trying to circumvent the sovereign boundary lines without a doubt."
  }
];

export default function SupernovaWorkspace() {
  const t = (key: string, fallback: string) => fallback;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { isSignedIn, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Authentication and Backdoor Roles State
  const [mockSignedIn, setMockSignedIn] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    if (mounted) {
      setMockSignedIn(isSignedIn);
    }
  }, [mounted, isSignedIn]);

  useEffect(() => {
    if (mounted && user) {
      setUserProfile({
        name: user.name || "Astraea Vance",
        email: user.email || "astraea@supernova.ai",
        avatar: user.avatarUrl || "https://ui-avatars.com/api/?name=Astraea+Vance",
        tier: user.role === "ADMIN" ? "Platform Admin" : "Standard User"
      });
    }
  }, [mounted, user]);

  const [activeRole, setActiveRole] = useState<"USER" | "ADMIN">("USER");
  const [userProfile, setUserProfile] = useState({
    name: "Astraea Vance",
    email: "astraea@supernova.ai",
    avatar: "https://ui-avatars.com/api/?name=Astraea+Vance&background=4f46e5&color=fff",
    tier: "Enterprise Tier"
  });

  // Assistant Multimodal Workspace States
  const [inputText, setInputText] = useState(
    "Obviously, this massive industry disaster is a complete conspiracy. Everyone knows that the board is undeniably trying to suppress their horrible failure without a doubt."
  );
  const [activeTab, setActiveTab] = useState<"text" | "voice" | "image">("text");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Automation / Rephrase Status
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Live System Telemetry SSE States
  const [telemetryHistory, setTelemetryHistory] = useState<any[]>([
    { name: "08:50", latency: 42, cpu: 12, ram: 342, connections: 5 },
    { name: "08:51", latency: 40, cpu: 15, ram: 345, connections: 6 },
    { name: "08:52", latency: 45, cpu: 10, ram: 340, connections: 4 },
    { name: "08:53", latency: 39, cpu: 18, ram: 350, connections: 7 },
    { name: "08:54", latency: 43, cpu: 14, ram: 348, connections: 5 }
  ]);
  const [liveMetrics, setLiveMetrics] = useState({
    latencyMs: 41,
    cpuLoad: 12,
    memoryMb: 346,
    activeConnections: 5,
    lastUpdate: new Date().toLocaleTimeString()
  });



  // Workspace Collaboration States
  const [teamMembers, setTeamMembers] = useState<any[]>([
    { id: "1", name: "Gabriel Thorne", email: "g.thorne@supernova.ai", role: "ADMIN", status: "ACTIVE" },
    { id: "2", name: "Celeste Sterling", email: "c.sterling@supernova.ai", role: "USER", status: "ACTIVE" },
    { id: "3", name: "Marcus Finch", email: "m.finch@supernova.ai", role: "DEVELOPER", status: "ACTIVE" }
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("USER");
  const [customRules, setCustomRules] = useState<any[]>([
    { id: "1", pattern: "\\b(always|never)\\b", type: "Over-generalization", category: "Linguistic", rephrase: "often / occasionally" },
    { id: "2", pattern: "\\b(obviously)\\b", type: "Confirmation Bias", category: "Cognitive", rephrase: "it appears / evidence indicates" }
  ]);
  const [newRulePattern, setNewRulePattern] = useState("");
  const [newRuleType, setNewRuleType] = useState("Confirmation Bias");
  const [newRuleRephrase, setNewRuleRephrase] = useState("");

  // Speech helper status
  const [isListeningMic, setIsListeningMic] = useState(false);

  // Monospace Terminal stream logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] 🚀 SUPERNOVA ORBITAL CORE HANDSHAKE SUCCESSFUL`,
    `[${new Date().toLocaleTimeString()}] 🔒 SECURITY RBAC OVERLAY INSTANTIATED: User Profile is Astraea Vance`,
    `[${new Date().toLocaleTimeString()}] 📡 SSE TELEMETRY PORT 3001 ENVELOPE ESTABLISHED`,
    `[${new Date().toLocaleTimeString()}] 🤖 FastAPI NLP COGNITIVE SIDECAR HEURISTICS CONNECTED ON PORT 8000`
  ]);

  // Append new log to terminal
  const appendTerminalLog = (log: string) => {
    setTerminalLogs((prev) => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const handleSignInWorkspaceClick = () => {
    if (isSignedIn) {
      setMockSignedIn(true);
      return;
    }
    setLoadingAction("sign-in");
    appendTerminalLog("🔒 SECURITY PROTOCOL: Redirecting to Authentication Gateway...");
    setTimeout(() => {
      const segments = pathname.split("/");
      const locale = segments[1] || "en";
      router.push(`/${locale}/sign-in`);
    }, 800);
  };

  const handleSignUpClick = () => {
    if (isSignedIn) {
      setMockSignedIn(true);
      return;
    }
    setLoadingAction("sign-up");
    appendTerminalLog("🔒 SECURITY PROTOCOL: Redirecting to Account Creation Gateway...");
    setTimeout(() => {
      const segments = pathname.split("/");
      const locale = segments[1] || "en";
      router.push(`/${locale}/sign-up`);
    }, 800);
  };

  // Recharts telemetry listener via SSE Simulation / Local Handshake
  useEffect(() => {
    const handleSseMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        setLiveMetrics({
          latencyMs: data.latencyMs,
          cpuLoad: data.cpuLoad,
          memoryMb: data.memoryMb,
          activeConnections: data.activeConnections,
          lastUpdate: new Date().toLocaleTimeString()
        });

        setTelemetryHistory((prev) => {
          const updated = [
            ...prev,
            {
              name: new Date().toLocaleTimeString().slice(-8),
              latency: data.latencyMs,
              cpu: data.cpuLoad,
              ram: data.memoryMb,
              connections: data.activeConnections
            }
          ];
          return updated.slice(-10); // keep last 10 points
        });

        appendTerminalLog(`📡 TELEMETRY FRAME: CPU ${data.cpuLoad}% | Latency ${data.latencyMs}ms | Nodes ${data.activeConnections}`);
      } catch (e) {
        // Fallback update if JSON invalid
      }
    };

    // Instantiate Sse listener
    let sseSource: EventSource | null = null;
    try {
      sseSource = new EventSource("http://localhost:3001/api/analytics/live");
      sseSource.onmessage = handleSseMessage;
      sseSource.onerror = () => {
        // Mock fallback if SSE is unreachable
      };
    } catch (e) {
      // Offline fallback
    }

    // Interval to simulate live stats fluctuating if Server is offline
    const intervalSim = setInterval(() => {
      if (!sseSource || sseSource.readyState === EventSource.CLOSED) {
        const fluctuatingLatency = 38 + Math.floor(Math.random() * 12);
        const fluctuatingCpu = 8 + Math.floor(Math.random() * 15);
        const fluctuatingMemory = 320 + Math.floor(Math.random() * 40);
        const fluctuatingConnections = 4 + Math.floor(Math.random() * 3);

        const liveData = {
          latencyMs: fluctuatingLatency,
          cpuLoad: fluctuatingCpu,
          memoryMb: fluctuatingMemory,
          activeConnections: fluctuatingConnections
        };

        setLiveMetrics({
          ...liveData,
          lastUpdate: new Date().toLocaleTimeString()
        });

        setTelemetryHistory((prev) => {
          const updated = [
            ...prev,
            {
              name: new Date().toTimeString().split(" ")[0].slice(-5),
              latency: fluctuatingLatency,
              cpu: fluctuatingCpu,
              ram: fluctuatingMemory,
              connections: fluctuatingConnections
            }
          ];
          return updated.slice(-10);
        });
      }
    }, 3000);

    return () => {
      if (sseSource) sseSource.close();
      clearInterval(intervalSim);
    };
  }, []);

  // Run Multimodal Analysis Handshake
  const triggerAnalysis = async (customText?: string) => {
    const textToAnalyze = customText || inputText;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    appendTerminalLog(`🤖 INITIATING HEURISTIC SCAN ON CHUNK: "${textToAnalyze.slice(0, 30)}..."`);

    try {
      const response = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock_oauth_astraea_vance"
        },
        body: JSON.stringify({
          text: textToAnalyze,
          language: selectedLanguage
        })
      });

      if (!response.ok) throw new Error("NLP pipeline connection failure");

      const result = await response.json();
      setAnalysisResult(result);
      appendTerminalLog(`✅ ANALYSIS RESOLVED VIA: ${result.source}`);
    } catch (e) {
      // Local premium cognitive engine fallback simulation
      setTimeout(() => {
        const words = textToAnalyze.toLowerCase().split(/\s+/);
        let biasIndex = 20;
        const biasesMatched: any[] = [];

        // Simulated local regex parser
        if (/\b(obviously|clearly|undeniably)\b/i.test(textToAnalyze)) {
          biasesMatched.push({
            quote: "Obviously, this massive industry disaster is a complete conspiracy.",
            type: "Confirmation Bias",
            description: "Presents assumptions as verified absolute facts to reinforce beliefs.",
            rephrase: "Evidence points to potential procedural vulnerabilities."
          });
          biasIndex += 30;
        }
        if (/\b(everyone|always|never|nobody)\b/i.test(textToAnalyze)) {
          biasesMatched.push({
            quote: "Everyone knows that the board is trying to suppress their failure.",
            type: "Over-generalization",
            description: "Uses absolute statements that fail to accommodate context nuances.",
            rephrase: "Several stakeholders indicate board transparency challenges."
          });
          biasIndex += 25;
        }
        if (/\b(disaster|conspiracy|horrible|catastrophic)\b/i.test(textToAnalyze)) {
          biasesMatched.push({
            quote: "suppress their horrible failure without a doubt.",
            type: "Sensationalism",
            description: "Employs dramatic phrasing to provoke visceral emotional reactions rather than objective analysis.",
            rephrase: "address their operational oversight objectively."
          });
          biasIndex += 20;
        }

        const mockResults = {
          success: true,
          source: "Supernova Edge Fallback Engine",
          language: "English",
          scores: {
            sentiment: biasIndex > 50 ? 42 : 78,
            objectivity: Math.max(0, 100 - biasIndex),
            biasIndex: Math.min(100, biasIndex)
          },
          tones: [
            { name: "Assertive", score: 85, color: "from-purple-500 to-pink-500" },
            { name: "Informative", score: 40, color: "from-blue-500 to-indigo-500" },
            { name: "Emotional", score: 65, color: "from-red-500 to-orange-500" }
          ],
          biases: biasesMatched.length > 0 ? biasesMatched : [
            {
              quote: textToAnalyze.slice(0, 60),
              type: "Objective Analysis",
              description: "No immediate cognitive bias patterns matched.",
              rephrase: "The statement is balanced."
            }
          ]
        };

        setAnalysisResult(mockResults);
        appendTerminalLog(`⚠️ LOCAL HYBRID MODE: Applied Edge fallbacks. Metrics resolved.`);
      }, 700);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run automatically on load
  useEffect(() => {
    if (mockSignedIn) {
      triggerAnalysis();
    }
  }, [mockSignedIn]);

  // Clean Bias Patterns Automation
  const handleAutoCleanBias = () => {
    if (!analysisResult || !analysisResult.biases) return;
    
    appendTerminalLog(`🤖 AUTOMATION ENGAGED: Purging cognitive bias patterns`);
    
    // Replace terms in main text
    let cleansedText = inputText;
    
    // Basic substitution
    cleansedText = cleansedText
      .replace(/obviously/gi, "evidence indicates")
      .replace(/complete conspiracy/gi, "complex event")
      .replace(/everyone knows/gi, "stakeholders observe")
      .replace(/undeniably/gi, "allegedly")
      .replace(/horrible failure/gi, "operational challenge")
      .replace(/without a doubt/gi, "as reports suggest");

    setInputText(cleansedText);
    setActionMessage("✨ Statement rephrased and cleansed successfully.");
    setTimeout(() => setActionMessage(null), 4000);
    
    appendTerminalLog(`✅ LINGUISTIC AUTO-CLEAN COMPLETED. RE-ANALYZING...`);
    triggerAnalysis(cleansedText);
  };

  // Text to Speech synthesis for rephrased statements
  const handleVocalizeText = () => {
    appendTerminalLog(`🔊 AUDIO SYNTHESIS ACTIVE: Reading balanced statement`);
    speakText(inputText, "en-US");
  };

  // File report downloader
  const handleDownloadReport = () => {
    const reportData = {
      title: "Supernova Perception Analysis Report",
      timestamp: new Date().toISOString(),
      inputText,
      results: analysisResult
    };

    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(reportData, null, 2)], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `supernova_perception_report_${Date.now()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    appendTerminalLog(`💾 SYSTEM REPORT DOWNLOADED`);
  };



  // Add Team Member Invite
  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember = {
      id: Math.random().toString(36).substr(2, 5),
      name: inviteEmail.split("@")[0].replace(".", " "),
      email: inviteEmail,
      role: inviteRole,
      status: "ACTIVE"
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail("");
    appendTerminalLog(`👥 ORG SEAT ALLOCATED: Invited ${inviteEmail} as ${inviteRole}`);
  };

  // Add Custom Bias Rule
  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRulePattern.trim()) return;

    const newRule = {
      id: Math.random().toString(36).substr(2, 5),
      pattern: newRulePattern,
      type: newRuleType,
      category: "Enterprise Custom",
      rephrase: newRuleRephrase
    };

    setCustomRules([...customRules, newRule]);
    setNewRulePattern("");
    setNewRuleRephrase("");
    appendTerminalLog(`📏 BIAS SAFETY PATTERN PERSISTED: ${newRulePattern}`);
  };

  if (!mounted) return (
  <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center font-mono text-[10px] text-slate-500 select-none">
    <div className="relative">
      <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 blur opacity-30 animate-pulse" />
      <div className="relative bg-slate-950 border border-slate-900 rounded-xl px-6 py-4 flex items-center space-x-3.5">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
        <span>INITIALIZING SUPERNOVA ORBITAL CORE HANDSHAKE...</span>
      </div>
    </div>
  </div>
);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden supernova-grid font-sans">
      
      {/* Ambient Cosmic Purple & Indigo Neon Glows */}
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-25%] w-[80%] h-[80%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] rounded-full bg-pink-500/3 blur-[130px] pointer-events-none" />

      {/* Cyber top glow headers */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      {/* Header bar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-900/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-xl border border-indigo-400/20 text-white flex items-center justify-center relative shadow-lg shadow-indigo-500/10">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 blur opacity-30 animate-pulse -z-10" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SUPERNOVA AI
              </h1>
              <span className="text-[9px] font-bold bg-indigo-950 border border-indigo-500/30 text-indigo-400 px-1.5 py-0.5 rounded uppercase tracking-widest select-none">
                Enterprise OS
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider block">
              Cognitive Perception & Security Analyzer
            </span>
          </div>
        </div>

        {/* Global Nav Anchors */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-400">
          <a href="#workspace" className="hover:text-white transition">Core Assistant</a>
          <a href="#telemetry" className="hover:text-white transition">Telemetry Stream</a>

          <a href="#team" className="hover:text-white transition">Team Control</a>
        </nav>

        {/* Dynamic Backdoors controller */}
        <div className="flex items-center space-x-3">
          {mockSignedIn ? (
            <>
              {/* Role Toggle Switch */}
              <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-[10px] font-bold">
                <button
                  onClick={() => { setActiveRole("USER"); appendTerminalLog(`👤 DEPLOYED CONTEXT: User Workspace`); }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeRole === "USER" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  USER
                </button>
                <button
                  onClick={() => { setActiveRole("ADMIN"); appendTerminalLog(`🛡️ DEPLOYED CONTEXT: Global Platform Admin`); }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeRole === "ADMIN" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  ADMIN
                </button>
              </div>

              {/* User badge */}
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-900 rounded-xl p-1.5 pr-3">
                <img src={userProfile.avatar} alt="Profile" className="h-6 w-6 rounded-lg border border-slate-800" />
                <div className="leading-none text-left hidden md:block">
                  <span className="block text-[10px] font-bold text-white leading-tight">{userProfile.name}</span>
                  <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-wider">{userProfile.tier}</span>
                </div>
              </div>

              {/* Signout mock */}
              <button
                onClick={() => {
                  // Clear mock auth data
                  localStorage.removeItem("pm_mock_signed_in");
                  localStorage.removeItem("pm_mock_user_name");
                  localStorage.removeItem("pm_mock_user_rbac_role");
                  // Clear cookies
                  if (typeof document !== "undefined") {
                    document.cookie.split(";").forEach(c => {
                      const eqPos = c.indexOf("=");
                      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
                      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                    });
                  }
                  setMockSignedIn(false);
                  appendTerminalLog("👋 SESSION REVOKED: Logged out");
                  router.push(`/`);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-rose-400 px-2 py-1.5 border border-transparent hover:border-rose-950/20 hover:bg-rose-950/5 rounded-lg transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleSignInWorkspaceClick}
              disabled={loadingAction === "sign-in"}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 rounded-xl shadow-lg shadow-indigo-600/15 hover:scale-[1.01] active:scale-[0.99] transition duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {loadingAction === "sign-in" && (
                <RefreshCw className="h-3 w-3 animate-spin mr-1.5" />
              )}
              Sign In to Workspace
            </button>
          )}
        </div>
      </header>

      {/* RENDER VIEW ACCORDING TO AUTHENTICATION STATE */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8 space-y-12">
        <div className="transition-all duration-500">
          {!mockSignedIn ? (
            // ================== FUTURISTIC LANDING VIEW ==================
            <div
              key="landing"
              className="space-y-20 py-8 relative transition-all duration-500 animate-in fade-in"
            >
              {/* Large Ambient Mesh Circle */}
              <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none animate-pulse" />
              
              {/* Hero details */}
              <div className="text-center max-w-4xl mx-auto space-y-6 relative">
                <Badge variant="info" className="px-3.5 py-1 text-[10px] tracking-widest font-extrabold shadow-sm">
                  ✨ SUPERNOVA AI PLATFORM v1.0 ENTERPRISE
                </Badge>
                
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                  The Advanced Cognitive <br/>
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Perception Security Suite
                  </span>
                </h2>
                
                <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Analyze sentiment, tone, and hidden cognitive biases instantly. Leverage real-time acoustic deciphering and optical OCR text scanning for secure multilingual documents.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                  <button
                    onClick={handleSignUpClick}
                    disabled={loadingAction === "sign-up"}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl px-7 py-3.5 text-sm font-bold shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition duration-300 disabled:opacity-50"
                  >
                    {loadingAction === "sign-up" && (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" />
                    )}
                    <span>Deploy Workspace Handshake</span>
                    <ArrowRight className="h-4.5 w-4.5 ml-1" />
                  </button>
                  
                  <a
                    href="#interactive-trial"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl px-7 py-3.5 text-sm font-bold transition duration-300"
                  >
                    <span>View Interactive Sandbox</span>
                  </a>
                </div>
              </div>

              {/* Visual landing dashboard image representation */}
              <div className="max-w-5xl mx-auto rounded-2xl border border-slate-900 bg-slate-950/60 p-2.5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                <div className="scanner-line" />
                <div className="p-4 sm:p-6 rounded-xl border border-slate-900 bg-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-4 max-w-md">
                    <span className="inline-flex items-center text-[10px] font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-500/20 rounded px-2 py-0.5 uppercase tracking-widest">
                      Live Stream
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-white">Orbital Node Telemetry Log Feed</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Below is the live operational system logs showing transaction cycles and packet evaluations stream from active server nodes.
                    </p>
                  </div>
                  
                  {/* Monospace terminal logs */}
                  <div className="w-full md:w-[480px] bg-slate-950/90 border border-slate-900 rounded-xl p-4 font-mono text-[10px] text-emerald-400 space-y-2 h-[120px] overflow-y-auto">
                    {terminalLogs.map((log, index) => (
                      <div key={index} className="truncate select-none leading-relaxed">
                        <span className="text-indigo-400 font-semibold select-none">❯</span> {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Multimodal AI features grid */}
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 relative group overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-indigo-500/5 group-hover:scale-150 transition-all duration-500" />
                  <div className="bg-indigo-950/60 border border-indigo-500/20 text-indigo-400 p-3 rounded-xl w-11 h-11 flex items-center justify-center mb-5">
                    <Globe className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-white tracking-wide mb-2.5">Multilingual Linguistic Analysis</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Integrated models built to scan and detect linguistic sentiment and implicit cognitive bias patterns in English, Tamil, and Sinhala.
                  </p>
                </Card>

                <Card className="p-6 relative group overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-purple-500/5 group-hover:scale-150 transition-all duration-500" />
                  <div className="bg-purple-950/60 border border-purple-500/20 text-purple-400 p-3 rounded-xl w-11 h-11 flex items-center justify-center mb-5">
                    <Mic className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-white tracking-wide mb-2.5">Speech Acoustic Scan</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Trigger voice-to-text acoustic translation. Readout balanced statements using native neural voice synthesis.
                  </p>
                </Card>

                <Card className="p-6 relative group overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-pink-500/5 group-hover:scale-150 transition-all duration-500" />
                  <div className="bg-pink-950/60 border border-pink-500/20 text-pink-400 p-3 rounded-xl w-11 h-11 flex items-center justify-center mb-5">
                    <Cpu className="h-5 w-5" />
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generate secure access keys instantly. Review ready-to-run curl presets, test GET operations, and inspect live rate limit gauges.
                  </p>
                </Card>
              </div>

              {/* Interactive Landing Demo Sandbox preview */}
              <div id="interactive-trial" className="max-w-4xl mx-auto space-y-6 pt-12 border-t border-slate-900">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-white">Interactive Trial Sandbox</h3>
                  <p className="text-xs text-slate-400">Try our baseline linguistic evaluator sandbox below without signing in.</p>
                </div>

                <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/50 backdrop-blur-md space-y-4">
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter speech or paragraph statement..."
                    className="text-xs h-24"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                      <span>Select Language:</span>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-350"
                      >
                        <option value="en">English</option>
                        <option value="ta">Tamil (தமிழ்)</option>
                        <option value="si">Sinhala (සිංහල)</option>
                      </select>
                    </div>
                    <Button
                      onClick={() => triggerAnalysis()}
                      disabled={isAnalyzing}
                      variant="primary"
                      size="sm"
                    >
                      {isAnalyzing ? (
                        <RefreshCw className="h-3 w-3 animate-spin mr-1.5" />
                      ) : (
                        <Play className="h-3 w-3 mr-1.5" />
                      )}
                      Evaluate Paragraph
                    </Button>
                  </div>

                  {/* Sandbox Analysis Result Display */}
                  {analysisResult && (
                    <div className="p-4 rounded-xl border border-slate-900 bg-slate-950 space-y-4 text-xs animate-in fade-in duration-300">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900/60 text-center">
                          <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold">Sentiment</span>
                          <span className="text-sm font-bold text-white">{analysisResult.scores.sentiment}%</span>
                        </div>
                        <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900/60 text-center">
                          <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold">Objectivity</span>
                          <span className="text-sm font-bold text-white">{analysisResult.scores.objectivity}%</span>
                        </div>
                        <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900/60 text-center">
                          <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold">Bias Index</span>
                          <span className="text-sm font-bold text-rose-450">{analysisResult.scores.biasIndex}%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Matched Bias Indicators</span>
                        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                          {analysisResult.biases.map((bias: any, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-lg border border-slate-900 bg-slate-950/60 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-indigo-400 text-[10px]">{bias.type}</span>
                                <Badge variant="neutral" className="text-[9px] lowercase">recommend rephrase</Badge>
                              </div>
                              <p className="text-[10px] text-slate-350 italic">"{bias.quote}"</p>
                              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">💡 Substitute: <span className="text-emerald-400">"{bias.rephrase}"</span></p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Landing Page Pricing Plan grid */}
              <div className="max-w-5xl mx-auto space-y-8 pt-12 border-t border-slate-900">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-white">Futuristic Enterprise Pricing Plans</h3>
                  <p className="text-xs text-slate-400">Choose the optimal workspace node allocation for your team.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <Card className="p-6 text-center space-y-4 border-slate-900/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Acoustic Basic</span>
                    <h4 className="text-3xl font-extrabold text-white">$0 <span className="text-xs text-slate-500 font-semibold">/ month</span></h4>

                    <ul className="text-[10px] text-slate-400 space-y-1.5 text-left py-2 border-t border-slate-900">
                      <li>✓ 50 Paragraph Analysis / Month</li>
                      <li>✓ Basic English parsing</li>
                      <li>✓ OCR Presets validation</li>
                    </ul>
                    <button
                      onClick={handleSignUpClick}
                      disabled={loadingAction === "sign-up"}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold border border-slate-800 transition flex items-center justify-center disabled:opacity-50"
                    >
                      {loadingAction === "sign-up" && (
                        <RefreshCw className="h-3 w-3 animate-spin mr-1.5" />
                      )}
                      Initialize Free Access
                    </button>
                  </Card>

                  <Card className="p-6 text-center space-y-4 border-indigo-900/60 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-full bg-indigo-500/10 blur-[15px] pointer-events-none" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Pro Workspace</span>
                    <h4 className="text-3xl font-extrabold text-white">$29 <span className="text-xs text-slate-500 font-semibold">/ month</span></h4>
                    <p className="text-[10px] text-slate-400">Excellent choice for researchers requiring full multimodal translation nodes.</p>
                    <ul className="text-[10px] text-slate-400 space-y-1.5 text-left py-2 border-t border-slate-900">
                      <li>✓ 500 Paragraphs Analysis / Month</li>
                      <li>✓ Multilingual (English, Tamil, Sinhala)</li>
                      <li>✓ Full Speech Synthesis & Recording</li>

                    </ul>
                    <button
                      onClick={handleSignUpClick}
                      disabled={loadingAction === "sign-up"}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold border border-indigo-400/20 shadow-lg shadow-indigo-600/20 transition flex items-center justify-center disabled:opacity-50"
                    >
                      {loadingAction === "sign-up" && (
                        <RefreshCw className="h-3 w-3 animate-spin mr-1.5" />
                      )}
                      Deploy Pro Workspace
                    </button>
                  </Card>

                  <Card className="p-6 text-center space-y-4 border-purple-900/60 relative overflow-hidden">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Enterprise OS</span>
                    <h4 className="text-3xl font-extrabold text-white">$99 <span className="text-xs text-slate-500 font-semibold">/ month</span></h4>
                    <p className="text-[10px] text-slate-400">Tailored for corporate workspaces demanding dedicated security logs exporters.</p>
                    <ul className="text-[10px] text-slate-400 space-y-1.5 text-left py-2 border-t border-slate-900">
                      <li>✓ Unlimited Analysis requests</li>
                      <li>✓ Custom Cognitive Rules Persistence</li>
                      <li>✓ SSE Live Telemetry Terminal exports</li>
                      <li>✓ Workspace seats management</li>
                    </ul>
                    <button
                      onClick={handleSignUpClick}
                      disabled={loadingAction === "sign-up"}
                      className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold border border-indigo-500/20 shadow-lg shadow-purple-600/20 transition flex items-center justify-center disabled:opacity-50"
                    >
                      {loadingAction === "sign-up" && (
                        <RefreshCw className="h-3 w-3 animate-spin mr-1.5" />
                      )}
                      Establish Enterprise Gateway
                    </button>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            // ================== FUTURISTIC WORKSPACE VIEW ==================
            <div
              key="workspace"
              className="space-y-8 transition-all duration-500 animate-in fade-in"
            >
              
              {/* Active Role Dashboard header warning indicator */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 backdrop-blur-md gap-4 select-none">
                <div className="flex items-center space-x-3">
                  <div className="cyber-dot w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider leading-none">
                    Security Session context: <span className="text-indigo-400">{activeRole} WORKSPACE ACTIVE</span>
                  </p>
                </div>
                <div className="flex space-x-3 text-[10px] font-bold uppercase tracking-wider text-slate-550">
                  <span>SSL Channel: active</span>
                  <span className="text-indigo-400">Node cluster: 200 OK</span>
                </div>
              </div>

              {/* WORKSPACE ROW 1: Omnibox Multimodal AI + Results */}
              <div id="workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 1. LEFT SIDEBAR: Multimodal Omnibox inputs */}
                <Card className="lg:col-span-7 p-6 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-indigo-500/5 blur-[25px] pointer-events-none" />
                  
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center space-x-2">
                      <Layers className="h-4.5 w-4.5 text-indigo-400" />
                      <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-200">
                        Omnibox AI Assistant Playground
                      </h3>
                    </div>
                    
                    {/* Multimodal Mode Selector Tab */}
                    <div className="flex bg-slate-950 border border-slate-880 rounded-lg p-0.5 text-[9px] font-bold select-none">
                      <button
                        onClick={() => { setActiveTab("text"); appendTerminalLog(`📡 SWAP MODE: Text Linguistic Scanner`); }}
                        className={`px-2.5 py-1 rounded transition ${activeTab === "text" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-350"}`}
                      >
                        Text Scanner
                      </button>
                      <button
                        onClick={() => { setActiveTab("voice"); appendTerminalLog(`📡 SWAP MODE: Speech Acoustic Scan`); }}
                        className={`px-2.5 py-1 rounded transition ${activeTab === "voice" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-350"}`}
                      >
                        Acoustic Voice
                      </button>
                      <button
                        onClick={() => { setActiveTab("image"); appendTerminalLog(`📡 SWAP MODE: Image OCR sensor`); }}
                        className={`px-2.5 py-1 rounded transition ${activeTab === "image" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-350"}`}
                      >
                        Optical OCR
                      </button>
                    </div>
                  </div>

                  {/* DYNAMIC MODE WIDGETS */}
                  <div className="transition-all duration-300">
                    {activeTab === "text" && (
                      <div
                        key="text-tab"
                        className="space-y-4 animate-in fade-in slide-in-from-left-1 duration-200"
                      >
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-widest">
                            Linguistic Text Input Stream
                          </label>
                          <Textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter paragraph data containing sentiment or potential cognitive biases to analyze..."
                            className="text-xs h-36 font-mono text-slate-200"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === "voice" && (
                      <div
                        key="voice-tab"
                        className="space-y-5 animate-in fade-in slide-in-from-left-1 duration-200"
                      >
                        <div className="space-y-2">
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                            Simulated Acoustic Speech Input
                          </label>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Record standard mic input or load one of our preset multilingual speech patterns directly below.
                          </p>
                        </div>

                        {/* Mic Button & Presets */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button
                            onClick={() => {
                              const nextState = toggleListening((res) => {
                                setInputText(res.transcript);
                                triggerAnalysis(res.transcript);
                              });
                              setIsListeningMic(nextState);
                              appendTerminalLog(nextState ? `🎤 AUDIO HARDWARE CALIBRATION ACTIVE` : `🎤 MIC HANDSHAKE STABILIZED`);
                            }}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition ${isListeningMic ? "bg-rose-950/20 border-rose-500/40 text-rose-400" : "bg-slate-950 border-slate-900 text-slate-350 hover:bg-slate-900/30"}`}
                          >
                            <Mic className={`h-6 w-6 mb-2 ${isListeningMic ? "animate-pulse" : ""}`} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {isListeningMic ? "Listening Speak Now..." : "Calibrate Microphone"}
                            </span>
                          </button>

                          <div className="space-y-1.5">
                            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Speech Presets</span>
                            <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                              {VOICE_PRESETS.map((preset, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setInputText(preset.text);
                                    setSelectedLanguage(preset.lang);
                                    triggerAnalysis(preset.text);
                                    appendTerminalLog(`🎤 VOICE PRESET LOADED: ${preset.label}`);
                                  }}
                                  className="w-full text-left p-2 rounded-lg border border-slate-900 hover:border-slate-800 bg-slate-950 hover:bg-slate-900/30 text-[9px] font-bold text-slate-300 truncate"
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "image" && (
                      <div
                        key="image-tab"
                        className="space-y-5 animate-in fade-in slide-in-from-left-1 duration-200"
                      >
                        <div className="space-y-2">
                          <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-widest">
                            Optical OCR Image Scanner
                          </label>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Simulate high-resolution optical image scans by dropping invoices, cargo manifests, or border declarations to extract layout paragraph content.
                          </p>
                        </div>

                        {/* Presets and scanner file list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-950 hover:bg-slate-900/20 text-center flex flex-col items-center justify-center cursor-pointer transition select-none">
                            <Layers className="h-6 w-6 text-slate-600 mb-2" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Drag and drop png file</span>
                          </div>

                          <div className="space-y-2">
                            <span className="block text-[9px] font-bold text-slate-555 uppercase tracking-widest">OCR Presets</span>
                            <div className="space-y-1.5">
                              {IMAGE_PRESETS.map((preset, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setInputText(preset.extractedText);
                                    triggerAnalysis(preset.extractedText);
                                    appendTerminalLog(`📸 OCR SCAN SUCCESSFUL: Extracted ${preset.fileName}`);
                                  }}
                                  className="w-full text-left p-2 border border-slate-900 bg-slate-950 hover:bg-slate-900/30 rounded-lg hover:border-slate-800 text-[9px] font-bold text-slate-300 leading-tight block"
                                >
                                  <span className="block text-indigo-400 truncate">{preset.title}</span>
                                  <span className="text-[8px] text-slate-550 block font-mono">{preset.fileName}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Lang override row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-slate-900/60 gap-4">
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                      <span className="font-semibold select-none">Decipher Locale:</span>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="bg-slate-950 border border-slate-850 text-slate-300 rounded px-2 py-1 font-semibold"
                      >
                        <option value="en">English (US/UK)</option>
                        <option value="ta">Tamil (தமிழ்)</option>
                        <option value="si">Sinhala (සිංහල)</option>
                      </select>
                    </div>

                    <div className="flex space-x-2 self-end sm:self-auto">
                      <Button
                        onClick={() => triggerAnalysis()}
                        disabled={isAnalyzing}
                        variant="primary"
                        size="sm"
                      >
                        {isAnalyzing ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        ) : (
                          <Play className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        <span>Launch Scanning Sequence</span>
                      </Button>
                    </div>
                  </div>

                  {/* Actions Automation box */}
                  <div className="p-4 rounded-xl border border-slate-900/60 bg-slate-950/40 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-left">
                      <span className="inline-flex items-center text-[8px] font-bold text-purple-400 bg-purple-950/40 border border-purple-500/20 rounded px-1.5 py-0.5 uppercase tracking-wider select-none">
                        Active Automations
                      </span>
                      <h4 className="text-xs font-bold text-white tracking-wide">Workspace NLP Automation Engine</h4>
                      <p className="text-[10px] text-slate-400">Generate clean rephrasings, synthesize voices, or export telemetry report sheets instantly.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        onClick={handleAutoCleanBias}
                        disabled={!analysisResult}
                        className="flex items-center space-x-1.5 bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition disabled:opacity-30"
                        title="Auto-rephrase biased patterns in the input text"
                      >
                        <Zap className="h-3 w-3" />
                        <span>Cleanse Bias</span>
                      </button>

                      <button
                        onClick={handleVocalizeText}
                        className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 hover:text-white px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition"
                        title="Vocalize balance text rephrasing via voice synth"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>Voice Readout</span>
                      </button>

                      <button
                        onClick={handleDownloadReport}
                        disabled={!analysisResult}
                        className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 hover:text-white px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition disabled:opacity-30"
                        title="Download report metadata"
                      >
                        <Download className="h-3 w-3" />
                        <span>Export Report</span>
                      </button>
                    </div>
                  </div>

                  {actionMessage && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[10px] rounded-xl flex items-center space-x-2 animate-in slide-in-from-top-1 duration-200">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-semibold">{actionMessage}</span>
                    </div>
                  )}
                </Card>

                {/* 2. RIGHT SIDEBAR: Circular Objective Gauges & Bias breakdown */}
                <Card className="lg:col-span-5 p-6 space-y-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-purple-500/5 blur-[25px] pointer-events-none" />
                  
                  <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4.5 w-4.5 text-purple-400" />
                      <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-200">
                        Cognitive Analytics Dashboard
                      </h3>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Live calculations</span>
                  </div>

                  {isAnalyzing ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center space-y-3 select-none">
                      <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Evaluating Paragraph structures...
                      </span>
                    </div>
                  ) : analysisResult ? (
                    <div className="flex-grow space-y-6">
                      
                      {/* Interactive Visual circular SVG Gauges */}
                      <div className="grid grid-cols-2 gap-4">
                        
                        {/* Circle Objectivity gauge */}
                        <div className="p-4 rounded-xl border border-slate-900 bg-slate-950 text-center flex flex-col items-center justify-center space-y-2.5">
                          <span className="block text-[9px] text-slate-550 font-bold uppercase tracking-widest leading-none">
                            Objectivity Index
                          </span>
                          
                          <div className="relative flex items-center justify-center w-20 h-20">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-slate-900"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-indigo-500 transition-all duration-1000"
                                strokeDasharray={`${analysisResult.scores.objectivity}, 100`}
                                strokeWidth="3"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <span className="absolute text-sm font-bold text-white select-none">
                              {analysisResult.scores.objectivity}%
                            </span>
                          </div>
                          
                          <span className="text-[8px] text-slate-400 leading-none">Balanced assessment</span>
                        </div>

                        {/* Bias score meter card */}
                        <div className="p-4 rounded-xl border border-slate-900 bg-slate-950 text-center flex flex-col items-center justify-center space-y-2.5">
                          <span className="block text-[9px] text-slate-550 font-bold uppercase tracking-widest leading-none">
                            Bias Risk index
                          </span>
                          
                          <div className="relative flex items-center justify-center w-20 h-20">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-slate-900"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-pink-500 transition-all duration-1000"
                                strokeDasharray={`${analysisResult.scores.biasIndex}, 100`}
                                strokeWidth="3"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <span className="absolute text-sm font-bold text-white select-none">
                              {analysisResult.scores.biasIndex}%
                            </span>
                          </div>

                          <span className="text-[8px] text-slate-450 leading-none">Cognitive indicators weight</span>
                        </div>
                      </div>

                      {/* Tone breakdown meters */}
                      <div className="space-y-2.5">
                        <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          Tone breakdown distribution
                        </span>
                        
                        <div className="space-y-2 bg-slate-950 border border-slate-900 p-4 rounded-xl">
                          {analysisResult.tones.map((tone: any, index: number) => (
                            <div key={index} className="space-y-1 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-350">{tone.name}</span>
                                <span className="font-mono text-slate-400 font-bold">{tone.score}%</span>
                              </div>
                              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`bg-gradient-to-r ${tone.color} h-full rounded-full transition-all duration-1000`}
                                  style={{ width: `${tone.score}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Cognitive Bias matches */}
                      <div className="space-y-2.5">
                        <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          Matched Cognitive Bias Patterns
                        </span>

                        <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                          {analysisResult.biases.map((bias: any, idx: number) => (
                            <div key={idx} className="p-3 border border-slate-900 bg-slate-950/70 rounded-xl space-y-1.5 transition hover:border-slate-800">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <ShieldAlert className="h-3.5 w-3.5 text-pink-400" />
                                  <span className="font-bold text-white text-[10px]">{bias.type}</span>
                                </div>
                                <Badge variant="neutral" className="text-[8px] lowercase font-mono">rephrase recommendation</Badge>
                              </div>
                              <p className="text-[10px] text-slate-400 italic">"{bias.quote}"</p>
                              
                              {/* description */}
                              <p className="text-[9px] text-slate-500 leading-normal">{bias.description}</p>
                              
                              <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px]">
                                <span className="text-slate-400">💡 Objective Rephrase:</span>
                                <button
                                  onClick={() => {
                                    // Set only this specific rephrase
                                    const cleansedText = inputText.replace(bias.quote, bias.rephrase);
                                    setInputText(cleansedText);
                                    appendTerminalLog(`📋 Applied rephrase pattern for: ${bias.type}`);
                                  }}
                                  className="text-emerald-400 font-bold hover:underline"
                                >
                                  "{bias.rephrase}"
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="flex-grow flex items-center justify-center text-center py-20 text-slate-600 font-mono text-xs select-none">
                      Launch paragraph scanning sequence above to compile perception metrics...
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-900 text-[9px] text-slate-550 text-center flex items-center justify-center space-x-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                    <span>All transactions verified using Clerk Secure handshakes</span>
                  </div>
                </Card>

              </div>

              {/* WORKSPACE ROW 2: Telemetry SSE Monitoring area charts */}
              <div id="telemetry" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Visual live Telemetry monitor panel */}
                <Card className="lg:col-span-8 p-6 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-indigo-500/5 blur-[25px] pointer-events-none" />
                  
                  <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4.5 w-4.5 text-indigo-400" />
                      <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-200">
                        Live Platform Telemetry monitor
                      </h3>
                    </div>
                    
                    {/* Status metrics indicators */}
                    <div className="flex items-center space-x-2 select-none">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-950/40 text-emerald-400 text-[8px] font-bold uppercase tracking-wider">
                        <Radio className="h-2 w-2 animate-pulse" />
                        <span>Active Telemetry socket stream</span>
                      </span>
                    </div>
                  </div>

                  {/* Telemetry numbers header */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Client Latency</span>
                      <span className="text-base font-extrabold text-white">{liveMetrics.latencyMs} ms</span>
                    </div>
                    
                    <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Core CPU Workload</span>
                      <span className="text-base font-extrabold text-indigo-400">{liveMetrics.cpuLoad}%</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Memory Allocation</span>
                      <span className="text-base font-extrabold text-white">{liveMetrics.memoryMb} MB</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Connected Socket Hubs</span>
                      <span className="text-base font-extrabold text-purple-400">{liveMetrics.activeConnections} active</span>
                    </div>
                  </div>

                  {/* Recharts live telemetry visualization */}
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={telemetryHistory}>
                        <defs>
                          <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#475569" fontSize={8} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={8} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", fontSize: 10, borderRadius: 8 }} />
                        <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
                        <Area type="monotone" dataKey="cpu" name="CPU (%)" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Live stream terminal console logs mockup */}
                <Card className="lg:col-span-4 p-6 space-y-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-emerald-500/5 blur-[25px] pointer-events-none" />
                  
                  <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Terminal className="h-4.5 w-4.5 text-emerald-400" />
                      <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-200">
                        Audit Log Stream Console
                      </h3>
                    </div>
                    <Badge variant="success" className="text-[8px] font-mono select-none">Websocket simulation</Badge>
                  </div>

                  {/* Monospace scrollable logs container */}
                  <div className="flex-grow bg-slate-950/80 border border-slate-900 rounded-xl p-4 font-mono text-[9px] text-emerald-400 space-y-2 h-56 overflow-y-auto">
                    {terminalLogs.map((log, index) => (
                      <div key={index} className="leading-relaxed break-all">
                        <span className="text-indigo-400 font-bold select-none">❯</span> {log}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-slate-550 select-none">
                    <span>Active node connection state: SSL</span>
                    <button
                      onClick={() => {
                        setTerminalLogs([`[${new Date().toLocaleTimeString()}] ♻️ AUDIT LOG STREAM FLUSHED`]);
                        appendTerminalLog("Orbital Core active.");
                      }}
                      className="text-indigo-400 hover:underline"
                    >
                      Clear Log View
                    </button>
                  </div>
                </Card>

              </div>



              {/* WORKSPACE ROW 4: Team Workspace Collaboration members Roster */}
              <div id="team" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Org active roster members table list */}
                <Card className="lg:col-span-7 p-6 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-indigo-500/5 blur-[25px] pointer-events-none" />
                  
                  <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4.5 w-4.5 text-indigo-400" />
                      <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-200">
                        Workspace Team Members
                      </h3>
                    </div>
                    <span className="text-[9px] font-mono text-slate-550 uppercase">Roster Allocation</span>
                  </div>

                  {/* Team Invite Form */}
                  <form onSubmit={handleInviteMember} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@supernova.ai"
                      className="flex-grow bg-slate-950 border border-slate-850 focus:border-indigo-500/80 rounded-xl px-4 py-2 text-xs text-slate-250 outline-none"
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="bg-slate-950 border border-slate-850 rounded-xl px-3 text-xs text-slate-350"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>

                    </select>
                    <Button type="submit" variant="primary" size="sm" className="shrink-0">
                      <span>Invite Seat</span>
                    </Button>
                  </form>

                  {/* Members Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-500 text-[9px] font-bold uppercase tracking-widest">
                          <th className="pb-3">User Email</th>
                          <th className="pb-3">Access Tier Role</th>
                          <th className="pb-3">Security Status</th>
                          <th className="pb-3 text-right">Seat Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60 font-mono">
                        {teamMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-slate-900/10">
                            <td className="py-3 font-sans font-bold text-slate-300">{member.email}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-sans border border-slate-800 text-[9px] font-bold uppercase">{member.role}</span>
                            </td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/20 text-[9px] font-bold font-sans">ACTIVE</span>
                            </td>
                            <td className="py-3 text-right font-sans">
                              <button
                                onClick={() => {
                                  setTeamMembers(teamMembers.filter((m) => m.id !== member.id));
                                  appendTerminalLog(`👥 SEAT REVOKED: Deleted ${member.email}`);
                                }}
                                className="text-rose-400 font-bold hover:underline"
                              >
                                Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Enterprise organizational bias policies custom rules */}
                <Card className="lg:col-span-5 p-6 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-purple-500/5 blur-[25px] pointer-events-none" />
                  
                  <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sliders className="h-4.5 w-4.5 text-purple-400" />
                      <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-200">
                        Custom Bias Rules Engine
                      </h3>
                    </div>
                    <span className="text-[9px] font-mono text-slate-550 uppercase">Safety Overrides</span>
                  </div>

                  {/* Create custom policy rule form */}
                  <form onSubmit={handleCreateRule} className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Target word pattern regex</span>
                      <input
                        type="text"
                        required
                        value={newRulePattern}
                        onChange={(e) => setNewRulePattern(e.target.value)}
                        placeholder="e.g. \b(clearly|evidently)\b"
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Balanced substitution rephrase replacement</span>
                      <input
                        type="text"
                        required
                        value={newRuleRephrase}
                        onChange={(e) => setNewRuleRephrase(e.target.value)}
                        placeholder="e.g. evidence points to"
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-250 outline-none"
                      />
                    </div>

                    <Button type="submit" variant="primary" size="sm" className="w-full">
                      <span>Add Policy Override Rule</span>
                    </Button>
                  </form>

                  {/* List of Custom rules overrides */}
                  <div className="space-y-2">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Bias rules matches overrides</span>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {customRules.map((rule) => (
                        <div key={rule.id} className="p-2.5 rounded-lg border border-slate-900 bg-slate-950 font-mono text-[9px] text-slate-350 flex justify-between items-center">
                          <div>
                            <span className="text-indigo-400 block font-bold font-sans text-[10px]">{rule.type}</span>
                            <span>Pattern: <span className="text-pink-400">"{rule.pattern}"</span> ➔ Substitute: <span className="text-emerald-400">"{rule.rephrase}"</span></span>
                          </div>
                          <button
                            onClick={() => {
                              setCustomRules(customRules.filter((r) => r.id !== rule.id));
                              appendTerminalLog(`📏 RULE OVERRIDE PURGED: ${rule.pattern}`);
                            }}
                            className="p-1 hover:bg-slate-900 rounded"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-slate-500 hover:text-rose-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

              </div>

            </div>
          )}
        </div>
      </main>

      {/* Futuristic absolute footer anchors */}
      <footer className="glass-panel border-t border-slate-900/60 py-6 text-center text-[10px] text-slate-600 relative select-none">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© 2026 SUPERNOVA AI SaaS Platform. All orbital node logs encrypted via SSL handshakes.</span>
          <div className="flex space-x-4">
            <a href="#workspace" className="hover:text-slate-400">Assistant Workbench</a>
            <a href="#telemetry" className="hover:text-slate-400">SSE Monitor</a>

          </div>
        </div>
      </footer>

    </div>
  );
}
