"use client";

import React from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { ShieldCheck, Activity, Clock, ShieldAlert, Sparkles } from "lucide-react";
import { Card } from "@perception-mapper/ui";

export default function ProDashboard() {
  const stats = [
    { label: "Active Gateways", val: "4 online", icon: ShieldCheck, text: "text-amber-400" },
    { label: "Analytic Velocity", val: "0.02 ms", icon: Activity, text: "text-amber-400" },
    { label: "Quota Limit", val: "Unlimited", icon: Clock, text: "text-amber-400" }
  ];

  return (
    <DashboardLayout theme="pro" activePage="pro">
      <div className="space-y-8 select-none text-left">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-5 bg-slate-955/40 border-purple-900/30 flex items-center justify-between shadow-purple-950/5 shadow-lg">
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
          <Card className="lg:col-span-7 p-6 bg-slate-955/20 border-purple-900/30 space-y-4">
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Recent Activity logs</span>
            <div className="space-y-3 font-mono text-[9px] text-slate-400">
              <div className="flex items-center space-x-2 border-b border-slate-900 pb-2">
                <span className="text-amber-400 font-bold">[12:15:05]</span>
                <span className="text-slate-300">Bi-directional WebSockets log stream handshake connected securely</span>
              </div>
              <div className="flex items-center space-x-2 border-b border-slate-900 pb-2">
                <span className="text-amber-400 font-bold">[11:58:34]</span>
                <span className="text-slate-300">Team workspace seat allocated: "dev-lead@perception.ai" active</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-amber-400 font-bold">[11:42:01]</span>
                <span className="text-slate-300">Pro core console bootloader completed successfully on Port 3001</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-5 p-6 bg-slate-955/20 border-purple-900/30 flex flex-col justify-between min-h-[180px]">
            <div className="space-y-3">
              <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active overrides options</span>
              <h4 className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                <ShieldAlert className="h-4 w-4 text-amber-400 animate-pulse" />
                <span>Enterprise Scope Unblocked</span>
              </h4>
              <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                You are currently running on the Pro scope. The entire suite, active telemetry charts, and administrative nodes are fully unblocked.
              </p>
            </div>
            <button className="w-full mt-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-650 to-pink-650 border border-purple-500/20 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition duration-300 flex items-center justify-center space-x-1.5 select-none">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span>Provision Next Key Node</span>
            </button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
