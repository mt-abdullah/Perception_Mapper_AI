"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../clerk-compat";
import {
  Users,
  TrendingUp,
  Cpu,
  Database,
  ShieldAlert,
  Lock,
  Unlock,
  Trash2,
  Settings,
  AlertCircle,
  RefreshCw,
  Sliders,
  CheckCircle,
  DollarSign,
  Activity,
  UserCheck
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  tier: string;
  isBlocked: boolean;
  analysesUsed: number;
  analysesLimit: number;
  createdAt: string;
}

interface AuditLog {
  id: string;
  userId: string;
  activity: string;
  details: string;
  status: string;
  latencyMs: number;
  tokensCount: number;
  createdAt: string;
}

interface GlobalStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  monthlyRevenue: number;
  totalAnalyses: number;
  reliabilityPercent: number;
}

export default function AdminView() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<GlobalStats>({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    monthlyRevenue: 0,
    totalAnalyses: 0,
    reliabilityPercent: 99.9,
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Policy Settings state
  const [rateLimit, setRateLimit] = useState(60);
  const [safetyOverride, setSafetyOverride] = useState("standard");
  const [quotaAllocation, setQuotaAllocation] = useState(500);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "x-mock-role": user?.role || "ADMIN",
  });

  const loadAdminTelemetry = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      // 1. Fetch Users
      const usersRes = await fetch("http://localhost:3001/api/admin/users", {
        headers: getHeaders(),
      });
      if (!usersRes.ok) throw new Error("Could not retrieve system users profile");
      const usersData = await usersRes.json();
      setUsers(usersData);

      // 2. Fetch Stats
      const statsRes = await fetch("http://localhost:3001/api/admin/analytics", {
        headers: getHeaders(),
      });
      if (!statsRes.ok) throw new Error("Could not retrieve telemetry analytics");
      const statsData = await statsRes.json();
      setStats(statsData);

      // 3. Fetch Audit Logs
      const logsRes = await fetch("http://localhost:3001/api/admin/audit-logs", {
        headers: getHeaders(),
      });
      if (!logsRes.ok) throw new Error("Could not retrieve security audit logs");
      const logsData = await logsRes.json();
      setAuditLogs(logsData);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to load admin controls" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminTelemetry();
  }, [user?.role]);

  const handleToggleBlock = async (targetUser: UserProfile) => {
    setActionLoading(targetUser.id);
    setFeedback(null);
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${targetUser.id}/block`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ isBlocked: !targetUser.isBlocked }),
      });
      if (!res.ok) throw new Error("Could not update user account suspension status");
      
      showFeedback("success", `Successfully ${targetUser.isBlocked ? "activated" : "suspended"} account ${targetUser.email}`);
      await loadAdminTelemetry();
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRole = async (targetUser: UserProfile) => {
    setActionLoading(targetUser.id);
    setFeedback(null);
    const newRole = targetUser.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${targetUser.id}/role`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Could not assign administrative role profile");
      
      showFeedback("success", `Updated role for ${targetUser.email} to ${newRole}`);
      await loadAdminTelemetry();
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you absolutely sure you want to delete the user account: ${email}? This action is permanent.`)) {
      return;
    }
    setActionLoading(userId);
    setFeedback(null);
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${userId}/delete`, {
        method: "POST",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Could not erase account from system database");
      
      showFeedback("success", `Successfully purged user account: ${email}`);
      await loadAdminTelemetry();
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    showFeedback("success", "AI Platform usage policies and limits modified successfully.");
  };

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Alert Feedbar */}
      {feedback && (
        <div
          className={`flex items-center space-x-3 p-4 rounded-xl border backdrop-blur-md transition-all ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
              : "bg-rose-950/40 border-rose-500/30 text-rose-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="h-5 w-5 shrink-0 animate-bounce" />
          ) : (
            <ShieldAlert className="h-5 w-5 shrink-0" />
          )}
          <span className="text-xs font-medium tracking-wide">{feedback.text}</span>
        </div>
      )}

      {/* Header and Refresh Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text mr-2">🛡️</span>
            Global Platform Admin Control
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time security auditing, policy configuration adjustments, and accounts management.
          </p>
        </div>
        <button
          onClick={loadAdminTelemetry}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 self-start px-3.5 py-2 text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition duration-300 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Sync Telemetry</span>
        </button>
      </div>

      {/* Telemetry Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md flex items-center space-x-4 relative overflow-hidden">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform Users</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{isLoading ? "..." : stats.totalUsers}</span>
          </div>
          <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 opacity-5 pointer-events-none">
            <Users className="h-24 w-24 text-white" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md flex items-center space-x-4 relative overflow-hidden">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estimated MRR</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{isLoading ? "..." : `$${stats.monthlyRevenue}`}</span>
          </div>
          <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 opacity-5 pointer-events-none">
            <DollarSign className="h-24 w-24 text-white" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md flex items-center space-x-4 relative overflow-hidden">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analyses Logged</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{isLoading ? "..." : stats.totalAnalyses}</span>
          </div>
          <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 opacity-5 pointer-events-none">
            <Activity className="h-24 w-24 text-white" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md flex items-center space-x-4 relative overflow-hidden">
          <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20 text-pink-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform Health</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{isLoading ? "..." : `${stats.reliabilityPercent}%`}</span>
          </div>
          <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 opacity-5 pointer-events-none">
            <Database className="h-24 w-24 text-white" />
          </div>
        </div>
      </div>

      {/* Main Administrative Control Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Accounts Manager */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center">
                <Users className="h-4 w-4 text-indigo-400 mr-2" />
                User Accounts Directory
              </h3>
              <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase">
                Active Registry
              </span>
            </div>

            {isLoading ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="h-6 w-6 text-indigo-400 animate-spin mx-auto" />
                <span className="text-xs text-slate-500 block">Synchronizing database grids...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-2">User Profile</th>
                      <th className="pb-3">Role Status</th>
                      <th className="pb-3">Analyses Quota</th>
                      <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 text-xs">
                    {users.map((item) => (
                      <tr key={item.id} className={`hover:bg-slate-900/20 transition-all ${item.isBlocked ? "opacity-60 bg-red-950/5" : ""}`}>
                        <td className="py-3.5 pl-2">
                          <div className="flex items-center space-x-3">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.email)}&background=1e1b4b&color=6366f1`}
                              alt={item.email}
                              className="h-7 w-7 rounded-lg border border-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="block font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]" title={item.email}>
                                {item.email}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                ID: {item.id.slice(0, 10)}...
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <div className="flex flex-col space-y-1">
                            <span
                              className={`self-start px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border ${
                                item.role === "ADMIN"
                                  ? "bg-purple-950/40 border-purple-500/20 text-purple-400"
                                  : "bg-slate-900 border-slate-800 text-slate-400"
                              }`}
                            >
                              {item.role}
                            </span>
                            <span className="text-[10px] text-slate-500">Tier: {item.tier}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <div className="flex flex-col space-y-1 max-w-[100px]">
                            <span className="text-white font-medium">
                              {item.analysesUsed} / {item.analysesLimit}
                            </span>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                              <div
                                className={`h-full rounded-full ${item.analysesUsed >= item.analysesLimit ? "bg-rose-500" : "bg-gradient-to-r from-indigo-500 to-purple-500"}`}
                                style={{ width: `${Math.min((item.analysesUsed / item.analysesLimit) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-2 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Block Toggle */}
                            <button
                              onClick={() => handleToggleBlock(item)}
                              disabled={actionLoading === item.id}
                              className={`p-1.5 rounded-lg border transition ${
                                item.isBlocked
                                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30"
                                  : "bg-amber-950/20 border-amber-500/30 text-amber-400 hover:bg-amber-900/30"
                              }`}
                              title={item.isBlocked ? "Activate User" : "Suspend User"}
                            >
                              {item.isBlocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                            </button>

                            {/* Role Switcher */}
                            <button
                              onClick={() => handleToggleRole(item)}
                              disabled={actionLoading === item.id || item.email === "dev@perceptionmapper.ai"}
                              className="p-1.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
                              title="Toggle Administrator Status"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                            </button>

                            {/* Purge Account */}
                            <button
                              onClick={() => handleDeleteUser(item.id, item.email)}
                              disabled={actionLoading === item.id || item.email === "dev@perceptionmapper.ai"}
                              className="p-1.5 rounded-lg border bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-900/30 transition disabled:opacity-30"
                              title="Purge Account permanently"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* AI Policies & safety controls */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center">
              <Sliders className="h-4 w-4 text-purple-400 mr-2" />
              Usage Policies
            </h3>
            
            <form onSubmit={handleSavePolicies} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Global Rate Limit (Sandbox APIs)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-indigo-500 transition"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-500 text-[10px] uppercase font-bold">reqs/min</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Safety Override Classification
                </label>
                <select
                  value={safetyOverride}
                  onChange={(e) => setSafetyOverride(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-indigo-500 transition"
                >
                  <option value="strict">Strict Assessment Mode</option>
                  <option value="standard">Standard Objective Parser</option>
                  <option value="lax">Permissive Free-form Mode</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Allocated Quota Pool (Default User)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={quotaAllocation}
                    onChange={(e) => setQuotaAllocation(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-indigo-500 transition"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-500 text-[10px] uppercase font-bold">analyses</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg transition duration-300"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Save Usage Policy</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Platform Activity Feed & Security Audit Log */}
      <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center">
            <Cpu className="h-4 w-4 text-pink-400 mr-2" />
            Security Audit Logs & Telemetry
          </h3>
          <span className="text-[10px] font-mono bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded-full uppercase">
            Platform Gateway
          </span>
        </div>

        {isLoading ? (
          <div className="py-10 text-center space-y-3">
            <RefreshCw className="h-5 w-5 text-pink-400 animate-spin mx-auto" />
            <span className="text-xs text-slate-500 block">Synchronizing audit logs...</span>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto space-y-2 border border-slate-900 rounded-xl p-3 bg-slate-950/60 font-mono text-[10px] leading-relaxed divide-y divide-slate-900/60">
            {auditLogs.length === 0 ? (
              <div className="text-center py-6 text-slate-500">No activity logs recorded.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-start md:items-center space-x-3">
                    <span className="text-slate-500 shrink-0">
                      [{new Date(log.createdAt).toLocaleTimeString()}]
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded shrink-0 font-bold uppercase ${
                        log.activity === "LOGIN"
                          ? "bg-indigo-950/40 text-indigo-400"
                          : log.activity.includes("BLOCK") || log.activity.includes("DELETE")
                          ? "bg-rose-950/40 text-rose-400"
                          : "bg-slate-900 text-slate-300"
                      }`}
                    >
                      {log.activity}
                    </span>
                    <span className="text-slate-300">{log.details}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-500 md:self-end shrink-0 pl-10 md:pl-0">
                    {log.latencyMs > 0 && <span>Latency: {log.latencyMs}ms</span>}
                    {log.tokensCount > 0 && <span>Tokens: {log.tokensCount}</span>}
                    <span
                      className={`font-semibold ${
                        log.status === "SUCCESS" ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
