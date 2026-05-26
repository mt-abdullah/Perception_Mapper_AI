"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useDashboard } from "../../../hooks/useDashboard";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Preloader from "../../../components/Preloader";
import MultimodalScanner from "../../../components/MultimodalScanner";
import CognitiveAnalytics from "../../../components/CognitiveAnalytics";
import LiveTelemetry from "../../../components/LiveTelemetry";
import AuditLogConsole from "../../../components/AuditLogConsole";
import TeamWorkspace from "../../../components/TeamWorkspace";
import CustomBiasRules from "../../../components/CustomBiasRules";
import { Card } from "@perception-mapper/ui";

export default function UserDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, user, mounted } = useAuth();
  
  const db = useDashboard();
  
  // Extract locale prefix
  const segments = pathname.split("/");
  const locale = segments[1] || "en";

  useEffect(() => {
    if (mounted && !isSignedIn) {
      router.replace(`/${locale}/sign-in`);
    }
  }, [mounted, isSignedIn, router, locale]);

  if (!mounted || !isSignedIn || !user) {
    return <Preloader message="AUTHORIZING USER WORKSPACE..." />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-25%] w-[80%] h-[80%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />
      <Navbar />

      <main className="flex-grow w-full max-w-[1600px] mx-auto px-6 py-24 space-y-8 relative z-10">
        <div className="flex items-center justify-between p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Security Session Context: <span className="text-indigo-400">USER WORKSPACE ACTIVE</span>
            </p>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">Node cluster: 200 OK</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
            <MultimodalScanner
              inputText={db.inputText} setInputText={db.setInputText}
              activeTab={db.activeTab} setActiveTab={db.setActiveTab}
              selectedLanguage={db.selectedLanguage} setSelectedLanguage={db.setSelectedLanguage}
              isAnalyzing={db.isAnalyzing} triggerAnalysis={db.triggerAnalysis}
              appendTerminalLog={db.appendTerminalLog}
            />
          </Card>

          <Card className="lg:col-span-5 p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
            <CognitiveAnalytics
              analysisResult={db.analysisResult}
              isAnalyzing={db.isAnalyzing}
              onRephrase={(quote, rephrase) => {
                const cleanText = db.inputText.replace(quote, rephrase);
                db.setInputText(cleanText);
                db.appendTerminalLog("💡 Applied objective rephrase pattern.");
              }}
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
            <LiveTelemetry liveMetrics={db.liveMetrics} telemetryHistory={db.telemetryHistory} />
          </Card>
          <Card className="lg:col-span-4 p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
            <AuditLogConsole terminalLogs={db.terminalLogs} onClearLogs={() => db.appendTerminalLog("♻️ AUDIT LOG STREAM FLUSHED")} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
            <TeamWorkspace
              teamMembers={db.teamMembers}
              onInvite={(email, role) => {
                const newMember = { id: Math.random().toString(36).substr(2, 5), name: email.split("@")[0], email, role, status: "ACTIVE" };
                db.setTeamMembers([...db.teamMembers, newMember]);
                db.appendTerminalLog(`👥 Seat allocated for: ${email}`);
              }}
              onRevoke={(id, email) => {
                db.setTeamMembers(db.teamMembers.filter((m) => m.id !== id));
                db.appendTerminalLog(`👥 Seat revoked for: ${email}`);
              }}
            />
          </Card>
          <Card className="lg:col-span-5 p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
            <CustomBiasRules
              customRules={db.customRules}
              onCreateRule={(pattern, rephrase) => {
                const newRule = { id: Math.random().toString(36).substr(2, 5), pattern, type: "Custom Rule", category: "Linguistic", rephrase };
                db.setCustomRules([...db.customRules, newRule]);
                db.appendTerminalLog(`📏 Custom rule policy persisted: ${pattern}`);
              }}
              onDeleteRule={(id, pattern) => {
                db.setCustomRules(db.customRules.filter((r) => r.id !== id));
                db.appendTerminalLog(`📏 Safety rule purged: ${pattern}`);
              }}
            />
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
export const dynamic = "force-dynamic";
