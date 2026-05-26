import { useState, useEffect, useCallback } from "react";
import { TeamMember, CustomRule, AnalysisResult } from "../types";
import { INITIAL_TEAM_MEMBERS, INITIAL_CUSTOM_RULES } from "../lib/constants";

export const useDashboard = () => {
  const [inputText, setInputText] = useState("Obviously, this disaster is a complete conspiracy. Everyone knows that the corporation is undeniably trying to cover up their horrible, catastrophic failure without a doubt.");
  const [activeTab, setActiveTab] = useState<"text" | "voice" | "image">("text");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [customRules, setCustomRules] = useState<CustomRule[]>(INITIAL_CUSTOM_RULES);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const [liveMetrics, setLiveMetrics] = useState({ latencyMs: 41, cpuLoad: 12, memoryMb: 346, activeConnections: 5 });
  const [telemetryHistory, setTelemetryHistory] = useState<any[]>([]);

  const appendTerminalLog = useCallback((log: string) => {
    setTerminalLogs((prev) => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${log}`]);
  }, []);

  // Telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const latency = 38 + Math.floor(Math.random() * 12);
      const cpu = 8 + Math.floor(Math.random() * 15);
      const ram = 320 + Math.floor(Math.random() * 40);
      const conn = 4 + Math.floor(Math.random() * 3);

      setLiveMetrics({ latencyMs: latency, cpuLoad: cpu, memoryMb: ram, activeConnections: conn });
      setTelemetryHistory((prev) => [...prev, { name: new Date().toLocaleTimeString().slice(-8), latency, cpu }].slice(-8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const triggerAnalysis = useCallback(async (customText?: string) => {
    const text = customText || inputText;
    if (!text.trim()) return;
    setIsAnalyzing(true);
    appendTerminalLog(`🤖 SCANNING CHUNK: "${text.slice(0, 35)}..."`);

    setTimeout(() => {
      let score = 20;
      const biasesMatched = [];
      if (/\b(obviously|clearly|undeniably)\b/i.test(text)) {
        biasesMatched.push({ quote: "Obviously, this disaster is a complete conspiracy.", type: "Confirmation Bias", description: "Presents assumptions as absolute facts.", rephrase: "Evidence points to potential procedural vulnerabilities." });
        score += 30;
      }
      if (/\b(everyone|always|never)\b/i.test(text)) {
        biasesMatched.push({ quote: "Everyone knows that the corporation is trying to cover up.", type: "Over-generalization", description: "Uses absolute statements that fail to accommodate context nuances.", rephrase: "Several stakeholders indicate transparency challenges." });
        score += 25;
      }

      setAnalysisResult({
        success: true,
        source: "Perception Edge Heuristics",
        language: "English",
        scores: { sentiment: score > 50 ? 42 : 78, objectivity: Math.max(0, 100 - score), biasIndex: score },
        tones: [
          { name: "Assertive", score: 85, color: "from-purple-500 to-pink-500" },
          { name: "Informative", score: 40, color: "from-blue-500 to-indigo-500" }
        ],
        biases: biasesMatched.length > 0 ? biasesMatched : [{ quote: text.slice(0, 50), type: "Objective Analysis", description: "No bias matched.", rephrase: "Balanced." }]
      });
      appendTerminalLog(`✅ ANALYSIS RESOLVED`);
      setIsAnalyzing(false);
    }, 600);
  }, [inputText, appendTerminalLog]);

  const cleanBias = useCallback(() => {
    let cleansed = inputText
      .replace(/obviously/gi, "evidence indicates")
      .replace(/complete conspiracy/gi, "complex event")
      .replace(/everyone knows/gi, "stakeholders observe")
      .replace(/undeniably/gi, "allegedly");
    setInputText(cleansed);
    setActionMessage("✨ Rephrased successfully.");
    setTimeout(() => setActionMessage(null), 3000);
    triggerAnalysis(cleansed);
  }, [inputText, triggerAnalysis]);

  return {
    inputText, setInputText,
    activeTab, setActiveTab,
    selectedLanguage, setSelectedLanguage,
    isAnalyzing, analysisResult, actionMessage,
    teamMembers, setTeamMembers,
    customRules, setCustomRules,
    terminalLogs, appendTerminalLog,
    liveMetrics, telemetryHistory,
    triggerAnalysis, cleanBias,
  };
};
