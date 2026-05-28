"use client";

import React from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { Zap, Activity, Clock, ShieldAlert, ChevronRight } from "lucide-react";
import { Card } from "@perception-mapper/ui";
import Link from "next/link";

export default function FreeDashboard() {
  const stats = [
    { label: "Active Gateways", val: "1 online", icon: Zap, text: "text-slate-400" },
    { label: "Analytic Velocity", val: "0.04 ms", icon: Activity, text: "text-slate-400" },
    { label: "Quota Limit", val: "100 / day", icon: Clock, text: "text-slate-400" }
  ];

  return (
    <DashboardLayout theme="free" activePage="free">
      <div className="space-y-8 select-none text-left">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-5 bg-slate-950/40 border-slate-900 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                  <span className="block text-sm font-bold text-slate-200">{stat.val}</span>
                </div>
                <div className={`p-3 bg-slate-955 border border-slate-900 rounded-xl ${stat.text}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-7 p-6 bg-slate-955/20 border-slate-900 space-y-4">
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Recent Activity logs</span>
            <div className="space-y-3 font-mono text-[9px] text-slate-400">
              <div className="flex items-center space-x-2 border-b border-slate-900 pb-2">
                <span className="text-slate-600 font-bold">[10:12:04]</span>
                <span className="text-slate-300">Baseline text scan processed (78% objective score)</span>
              </div>
              <div className="flex items-center space-x-2 border-b border-slate-900 pb-2">
                <span className="text-slate-600 font-bold">[09:43:12]</span>
                <span className="text-slate-300">Microphone session voice preset loaded securely</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-600 font-bold">[09:12:05]</span>
                <span className="text-slate-300">Free console connection handshake successful</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-5 p-6 bg-slate-955/20 border-slate-900 flex flex-col justify-between min-h-[180px]">
            <div className="space-y-3">
              <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active overrides options</span>
              <h4 className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <ShieldAlert className="h-4 w-4 text-slate-400 animate-pulse" />
                <span>Standard Workspace Limitations</span>
              </h4>
              <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                You are currently running on the Free scope. Upgrading unblocks live telemetry graphs and custom overrides.
              </p>
            </div>
            <Link href="/dashboard/basic" className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-800 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition duration-300 flex items-center justify-center space-x-1">
              <span>Upgrade to Basic Scope</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
