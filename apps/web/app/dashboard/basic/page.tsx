"use client";

import React from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { Flame, Activity, Clock, ShieldAlert, ChevronRight } from "lucide-react";
import { Card } from "@perception-mapper/ui";
import Link from "next/link";

export default function BasicDashboard() {
  const stats = [
    { label: "Active Gateways", val: "2 online", icon: Flame, text: "text-blue-400" },
    { label: "Analytic Velocity", val: "0.03 ms", icon: Activity, text: "text-blue-400" },
    { label: "Quota Limit", val: "5,000 / day", icon: Clock, text: "text-blue-400" }
  ];

  return (
    <DashboardLayout theme="basic" activePage="basic">
      <div className="space-y-8 select-none text-left">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-5 bg-slate-955/40 border-blue-900/20 flex items-center justify-between shadow-blue-955/5 shadow-lg">
                <div className="space-y-1">
                  <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                  <span className="block text-sm font-bold text-slate-200">{stat.val}</span>
                </div>
                <div className={`p-3 bg-slate-950 border border-slate-900 rounded-xl ${stat.text}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-7 p-6 bg-slate-955/20 border-blue-900/20 space-y-4">
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Recent Activity logs</span>
            <div className="space-y-3 font-mono text-[9px] text-slate-400">
              <div className="flex items-center space-x-2 border-b border-slate-900 pb-2">
                <span className="text-blue-450 font-bold">[11:04:12]</span>
                <span className="text-slate-300">Custom rules override matching: "மிகவும்" rephrased successfully</span>
              </div>
              <div className="flex items-center space-x-2 border-b border-slate-900 pb-2">
                <span className="text-blue-450 font-bold">[10:48:32]</span>
                <span className="text-slate-300">Live telemetry speed metrics logged: 0.03 ms latency resolved</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-450 font-bold">[09:58:16]</span>
                <span className="text-slate-300">Basic console secure connection established</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-5 p-6 bg-slate-955/20 border-blue-900/20 flex flex-col justify-between min-h-[180px]">
            <div className="space-y-3">
              <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active overrides options</span>
              <h4 className="text-xs font-bold text-blue-400 flex items-center space-x-1.5">
                <ShieldAlert className="h-4 w-4 text-blue-400 animate-pulse" />
                <span>Professional Rule Upgrades Available</span>
              </h4>
              <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                You are currently running on the Basic scope. Upgrading to Pro unblocks live WebSockets server traces and allocations.
              </p>
            </div>
            <Link href="/dashboard/pro" className="w-full mt-4 py-2.5 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-500/30 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition duration-300 flex items-center justify-center space-x-1">
              <span>Upgrade to Pro Console</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
