"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useContext } from "react";
import { AdminTabContext } from "../layout";
import { useAuth } from "../../../clerk-compat";
import {
  Users,
  Sliders,
  Cpu,
  RefreshCw,
  Search,
  Lock,
  Unlock,
  Trash2,
  Settings,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Download,
  Activity,
  DollarSign,
  Database,
  Terminal,
  Filter,
  Check
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: string;
  tier: string;
  plan?: string;
  isBlocked: boolean;
  status?: string;
  analysesUsed: number;
  analysesLimit: number;
  lastLogin: string;
  totalAiRequests: number;
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

interface PolicySettings {
  textEnabled: boolean;
  voiceEnabled: boolean;
  imageEnabled: boolean;
  limitFree: number;
  limitPro: number;
  limitTeam: number;
  rateFree: number;
  ratePro: number;
  rateTeam: number;
  experimentalToggle: boolean;
  updatedAt: string;
}

export default function AdminDashboardIndex() {
  const { activeTab } = useContext(AdminTabContext);
  const { user } = useAuth();

  // Unified administrative states
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<GlobalStats>({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    monthlyRevenue: 0,
    totalAnalyses: 0,
    reliabilityPercent: 99.9,
  });
  
  // Policies State
  const [policies, setPolicies] = useState<PolicySettings>({
    textEnabled: true,
    voiceEnabled: true,
    imageEnabled: true,
    limitFree: 50,
    limitPro: 500,
    limitTeam: 5000,
    rateFree: 10,
    ratePro: 60,
    rateTeam: 300,
    experimentalToggle: false,
    updatedAt: new Date().toISOString(),
  });

  // UI Utilities states
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Custom Glassmorphic Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    isDestructive: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    isDestructive: false,
    onConfirm: () => {},
  });

  // Filters / Search states
  const [userSearch, setUserSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [logFilterActivity, setLogFilterActivity] = useState("ALL");
  const [logFilterStatus, setLogFilterStatus] = useState("ALL");
  const [userPage, setUserPage] = useState(1);
  const usersPerPage = 5;

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "x-mock-role": user?.role || "ADMIN",
  });

  const loadAdministrativePayload = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      // 1. Fetch Users List using standard REST endpoint
      const usersRes = await fetch("http://localhost:3001/api/users", {
        headers: getHeaders(),
      });
      if (!usersRes.ok) throw new Error("Could not sync users database catalog");
      const usersData = await usersRes.json();
      setUsers(usersData);

      // 2. Fetch Stats Overview
      const statsRes = await fetch("http://localhost:3001/api/admin/analytics", {
        headers: getHeaders(),
      });
      if (!statsRes.ok) throw new Error("Could not fetch platform load telemetry");
      const statsData = await statsRes.json();
      setStats(statsData);

      // 3. Fetch Audit Logs
      const logsRes = await fetch("http://localhost:3001/api/admin/audit-logs", {
        headers: getHeaders(),
      });
      if (!logsRes.ok) throw new Error("Could not retrieve system security feeds");
      const logsData = await logsRes.json();
      setAuditLogs(logsData);

      // 4. Fetch Global AI Policies
      const policiesRes = await fetch("http://localhost:3001/api/admin/policies", {
        headers: getHeaders(),
      });
      if (policiesRes.ok) {
        const policiesData = await policiesRes.json();
        setPolicies(policiesData);
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to load telemetry payload" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdministrativePayload();
  }, [user?.role, activeTab]);

  const triggerFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // --- 1. USER MANAGER ACTIONS ---
  const handleToggleBlock = (item: UserProfile) => {
    const nextStatus = item.isBlocked || item.role === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    const nextIsBlocked = nextStatus === "BLOCKED";
    setConfirmModal({
      isOpen: true,
      title: nextIsBlocked ? "Suspend User Profile" : "Unlock User Profile",
      message: `Are you sure you want to ${nextIsBlocked ? "suspend" : "reactivate"} the user account for ${item.email}? ${nextIsBlocked ? "This will block them from accessing all platform features." : "This will restore full access to their dashboard and analyses."}`,
      confirmText: nextIsBlocked ? "Suspend Account" : "Unlock Account",
      isDestructive: nextIsBlocked,
      onConfirm: async () => {
        setActionLoading(item.id);
        try {
          const res = await fetch(`http://localhost:3001/api/users/${item.id}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ status: nextStatus }),
          });
          if (!res.ok) throw new Error("Could not update target user status");
          triggerFeedback("success", `Account ${item.email} successfully ${nextIsBlocked ? "suspended" : "activated"}`);
          await loadAdministrativePayload();
        } catch (err: any) {
          triggerFeedback("error", err.message);
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const handleToggleRole = (item: UserProfile) => {
    if (item.email === "dev@perceptionmapper.ai") return;
    const newRole = item.role === "ADMIN" ? "USER" : "ADMIN";
    setConfirmModal({
      isOpen: true,
      title: newRole === "ADMIN" ? "Promote User to Admin" : "Demote Admin to User",
      message: `Are you sure you want to change the permissions for ${item.email} from ${item.role} to ${newRole}?`,
      confirmText: "Confirm Change",
      isDestructive: newRole === "USER",
      onConfirm: async () => {
        setActionLoading(item.id);
        try {
          const res = await fetch(`http://localhost:3001/api/users/${item.id}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ role: newRole }),
          });
          if (!res.ok) throw new Error("Could not update target user administrative role");
          triggerFeedback("success", `Promoted ${item.email} to ${newRole}`);
          await loadAdministrativePayload();
        } catch (err: any) {
          triggerFeedback("error", err.message);
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const handleUpdatePlanTier = (userId: string, email: string, tier: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Modify Subscription Plan",
      message: `Are you sure you want to change the subscription plan tier for ${email} to the ${tier} plan?`,
      confirmText: "Update Plan",
      isDestructive: false,
      onConfirm: async () => {
        setActionLoading(userId);
        try {
          const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ plan: tier }),
          });
          if (!res.ok) throw new Error("Failed to change user plan tier configuration");
          triggerFeedback("success", `Updated user plan tier successfully to ${tier}`);
          await loadAdministrativePayload();
        } catch (err: any) {
          triggerFeedback("error", err.message);
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const handleDeleteUser = (userId: string, email: string) => {
    if (email === "dev@perceptionmapper.ai") return;
    setConfirmModal({
      isOpen: true,
      title: "Purge User Account Permanently",
      message: `Are you absolutely sure you want to delete the user account for ${email}? This action is irreversible. All analyses, api keys, and associated logs will be permanently deleted from the database.`,
      confirmText: "Purge Account",
      isDestructive: true,
      onConfirm: async () => {
        setActionLoading(userId);
        try {
          const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
            method: "DELETE",
            headers: getHeaders(),
          });
          if (!res.ok) throw new Error("Could not delete user account from systems");
          triggerFeedback("success", `Purged user account: ${email}`);
          await loadAdministrativePayload();
        } catch (err: any) {
          triggerFeedback("error", err.message);
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  // --- 2. AI POLICY ENFORCEMENT ACTIONS ---
  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/admin/policies", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(policies),
      });
      if (!res.ok) throw new Error("Could not sync policy controls");
      triggerFeedback("success", "AI global features safety limits and quotas cached successfully");
      await loadAdministrativePayload();
    } catch (err: any) {
      triggerFeedback("error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. AUDIT LOGS CSV EXPORTER ---
  const triggerCsvExport = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Log ID,Timestamp,Event,Details,Status,Latency (ms),Tokens\n";

      auditLogs.forEach((log) => {
        const row = [
          log.id,
          new Date(log.createdAt).toISOString(),
          log.activity,
          `"${log.details?.replace(/"/g, '""') || ""}"`,
          log.status,
          log.latencyMs,
          log.tokensCount
        ].join(",");
        csvContent += row + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `perception_security_audit_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerFeedback("success", "CSV spreadsheet downloaded successfully");
    } catch (e) {
      triggerFeedback("error", "Could not export security logs");
    }
  };

  // Filter and Paginate users safely
  const filteredUsers = users.filter((u) => {
    if (!u) return false;
    const query = userSearch.toLowerCase();
    const emailMatches = u.email ? u.email.toLowerCase().includes(query) : false;
    const nameMatches = u.name ? u.name.toLowerCase().includes(query) : false;
    return emailMatches || nameMatches;
  });

  const paginatedUsers = filteredUsers.slice((userPage - 1) * usersPerPage, userPage * usersPerPage);

  // Render components dynamically based on layout activeTab context
  return (
    <div className="space-y-6">
      {/* Dynamic Action Alerts */}
      {feedback && (
        <div
          className={`flex items-center space-x-3 p-4 rounded-xl border backdrop-blur-md transition-all ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
              : "bg-rose-950/40 border-rose-500/30 text-rose-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="h-4.5 w-4.5 shrink-0 animate-bounce" />
          ) : (
            <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
          )}
          <span className="text-xs font-semibold tracking-wide">{feedback.text}</span>
        </div>
      )}

      {/* RENDER VIEW SWITCHERS */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md relative overflow-hidden">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Registry</span>
              <span className="text-xl font-bold text-white mt-1 block">{isLoading ? "..." : stats.totalUsers}</span>
              <div className="absolute right-3 bottom-3 opacity-5">
                <Users className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md relative overflow-hidden">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Workspace MRR</span>
              <span className="text-xl font-bold text-white mt-1 block">{isLoading ? "..." : `$${stats.monthlyRevenue}`}</span>
              <div className="absolute right-3 bottom-3 opacity-5">
                <DollarSign className="h-10 w-10 text-white" />
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md relative overflow-hidden">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analyses Volume</span>
              <span className="text-xl font-bold text-white mt-1 block">{isLoading ? "..." : stats.totalAnalyses}</span>
              <div className="absolute right-3 bottom-3 opacity-5">
                <Activity className="h-10 w-10 text-white" />
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md relative overflow-hidden">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gateway Firewall Uptime</span>
              <span className="text-xl font-bold text-white mt-1 block">{isLoading ? "..." : `${stats.reliabilityPercent}%`}</span>
              <div className="absolute right-3 bottom-3 opacity-5">
                <Database className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          {/* Quick info panel */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center">
              <Terminal className="h-4 w-4 text-purple-400 mr-2" />
              Administrative Telemetry workbench
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use the sidebar panel menu to switch to active administrative modules. You can manage registered users list directories, allocate cognitive analysis policies limits, and review live security activity audit feeds instantly.
            </p>
          </div>
        </div>
      )}

      {/* USER MANAGER MODULE */}
      {activeTab === "users" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md space-y-5">
            {/* Search Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setUserPage(1);
                  }}
                  placeholder="Search user name or email..."
                  className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-650 outline-none transition"
                />
              </div>
              <button
                onClick={loadAdministrativePayload}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 px-3.5 py-2.5 text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Sync Directory</span>
              </button>
            </div>

            {/* Users Directory Table */}
            {isLoading ? (
              <div className="space-y-3">
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-slate-900/60 bg-slate-950/20 gap-4"
                    >
                      <div className="flex items-center space-x-3 w-full sm:w-1/3 animate-pulse">
                        <div className="h-8 w-8 rounded-lg bg-slate-900 shrink-0" />
                        <div className="space-y-2 w-full">
                          <div className="h-3.5 bg-slate-900 rounded w-3/4" />
                          <div className="h-2.5 bg-slate-900/60 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="h-5 bg-slate-900 rounded w-16 hidden sm:block animate-pulse" />
                      <div className="h-5 bg-slate-900 rounded w-14 hidden sm:block animate-pulse" />
                      <div className="h-4 bg-slate-900 rounded w-12 hidden sm:block animate-pulse" />
                      <div className="flex space-x-2 shrink-0 self-end sm:self-auto animate-pulse">
                        <div className="h-8 w-8 rounded bg-slate-900" />
                        <div className="h-8 w-8 rounded bg-slate-900" />
                        <div className="h-8 w-8 rounded bg-slate-900" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-2">User details</th>
                      <th className="pb-3">Plan Tier</th>
                      <th className="pb-3">Access Level</th>
                      <th className="pb-3">Total Requests</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 text-xs">
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-xs text-slate-500 font-semibold">
                          No registered user profiles matched search query.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((item) => {
                        const isBlocked = item.isBlocked || item.status === "BLOCKED";
                        return (
                          <tr key={item.id} className={`hover:bg-slate-900/10 transition ${isBlocked ? "opacity-60 bg-red-950/5" : ""}`}>
                            <td className="py-3.5 pl-2">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || item.email || "User")}&background=3b0764&color=c084fc`}
                                  alt={item.email || "User"}
                                  className="h-8 w-8 rounded-lg border border-slate-850 shrink-0"
                                />
                                <div className="min-w-0">
                                  <span className="block font-semibold text-white truncate max-w-[150px] sm:max-w-[200px]" title={item.email}>
                                    {item.name || item.email?.split("@")[0] || "Unknown"}
                                  </span>
                                  <span className="block text-[9px] text-slate-400 font-medium truncate max-w-[150px] sm:max-w-[200px]">
                                    {item.email || "no-email@perceptionmapper.ai"}
                                  </span>
                                  <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                                    Last Login: {item.lastLogin ? new Date(item.lastLogin).toLocaleDateString() : "Never"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5">
                              {item.email === "dev@perceptionmapper.ai" ? (
                                <span className="text-[10px] font-bold uppercase text-purple-400">PRO Plan</span>
                              ) : (
                                <select
                                  value={item.plan || item.tier || "FREE"}
                                  onChange={(e) => handleUpdatePlanTier(item.id, item.email || "Unknown", e.target.value)}
                                  className="bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-slate-200 text-[10px] font-bold focus:border-purple-500 transition outline-none"
                                >
                                  <option value="FREE">FREE</option>
                                  <option value="PRO">PRO</option>
                                  <option value="TEAM">TEAM</option>
                                </select>
                              )}
                            </td>
                            <td className="py-3.5">
                              <span
                                className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase border ${
                                  (item.role || "USER").toUpperCase() === "ADMIN"
                                    ? "bg-purple-950/40 border-purple-500/20 text-purple-400"
                                    : "bg-slate-900 border-slate-800 text-slate-400"
                                }`}
                              >
                                {item.role || "USER"}
                              </span>
                            </td>
                            <td className="py-3.5">
                              <span className="font-mono text-slate-300">{item.totalAiRequests || 0} calls</span>
                            </td>
                            <td className="py-3.5 pr-2 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                {/* Block Toggle */}
                                <button
                                  onClick={() => handleToggleBlock(item)}
                                  disabled={actionLoading === item.id}
                                  className={`p-1.5 rounded-lg border transition ${
                                    isBlocked
                                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30"
                                      : "bg-amber-950/20 border-amber-500/30 text-amber-400 hover:bg-amber-900/30"
                                  }`}
                                  title={isBlocked ? "Unlock profile" : "Block profile"}
                                >
                                  {isBlocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                                </button>

                                {/* Promotes Toggle */}
                                <button
                                  onClick={() => handleToggleRole(item)}
                                  disabled={actionLoading === item.id || item.email === "dev@perceptionmapper.ai"}
                                  className="p-1.5 rounded-lg border bg-slate-900 border-slate-850 text-slate-400 hover:text-white hover:border-slate-700 transition"
                                  title="Toggle Administrative Status"
                                >
                                  <ShieldAlert className="h-3.5 w-3.5" />
                                </button>

                                {/* Purge delete */}
                                <button
                                  onClick={() => handleDeleteUser(item.id, item.email || "Unknown")}
                                  disabled={actionLoading === item.id || item.email === "dev@perceptionmapper.ai"}
                                  className="p-1.5 rounded-lg border bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-900/30 transition disabled:opacity-30"
                                  title="Purge Account permanently"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination footer */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-900 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span>
                Showing {filteredUsers.length === 0 ? 0 : (userPage - 1) * usersPerPage + 1} to{" "}
                {Math.min(userPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} entries
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
                  disabled={userPage === 1}
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-850 text-slate-350 hover:text-white transition disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() => {
                    if (userPage * usersPerPage < filteredUsers.length) {
                      setUserPage((p) => p + 1);
                    }
                  }}
                  disabled={userPage * usersPerPage >= filteredUsers.length}
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-850 text-slate-350 hover:text-white transition disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI ENGINE POLICIES MODULE */}
      {activeTab === "policies" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-900">
              <div>
                <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center">
                  <Sliders className="h-4 w-4 text-purple-400 mr-2" />
                  Global AI Engines safety limits & safety overrides
                </h3>
                <span className="text-[9px] text-slate-500">Last updated: {new Date(policies.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>

            <form onSubmit={handleSavePolicies} className="space-y-6 text-xs">
              {/* Feature toggles */}
              <div className="space-y-3">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Linguistic Perception Feature Toggles
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <span className="block font-semibold text-white">Text Perception Analysis</span>
                      <span className="text-[10px] text-slate-500 leading-relaxed block mt-0.5">Linguistic objective evaluation</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={policies.textEnabled}
                      onChange={(e) => setPolicies({ ...policies, textEnabled: e.target.checked })}
                      className="accent-purple-500 h-4 w-4 rounded border-slate-800"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <span className="block font-semibold text-white">Voice Decipher Engine</span>
                      <span className="text-[10px] text-slate-500 leading-relaxed block mt-0.5">Speech acoustic scanning</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={policies.voiceEnabled}
                      onChange={(e) => setPolicies({ ...policies, voiceEnabled: e.target.checked })}
                      className="accent-purple-500 h-4 w-4 rounded border-slate-800"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <span className="block font-semibold text-white">Image Optical Scanner</span>
                      <span className="text-[10px] text-slate-500 leading-relaxed block mt-0.5">Document scanning frameworks</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={policies.imageEnabled}
                      onChange={(e) => setPolicies({ ...policies, imageEnabled: e.target.checked })}
                      className="accent-purple-500 h-4 w-4 rounded border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Limit Allocations */}
              <div className="space-y-3">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Analyses Limits Per plan Tier (Monthly Quotas)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">FREE limits</label>
                    <input
                      type="number"
                      value={policies.limitFree}
                      onChange={(e) => setPolicies({ ...policies, limitFree: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-purple-500 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">PRO limits</label>
                    <input
                      type="number"
                      value={policies.limitPro}
                      onChange={(e) => setPolicies({ ...policies, limitPro: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-purple-500 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">TEAM limits</label>
                    <input
                      type="number"
                      value={policies.limitTeam}
                      onChange={(e) => setPolicies({ ...policies, limitTeam: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Rate Limits */}
              <div className="space-y-3">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  API sandbox request rate limiting (Requests Per Minute)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">FREE rate</label>
                    <input
                      type="number"
                      value={policies.rateFree}
                      onChange={(e) => setPolicies({ ...policies, rateFree: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-purple-500 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">PRO rate</label>
                    <input
                      type="number"
                      value={policies.ratePro}
                      onChange={(e) => setPolicies({ ...policies, ratePro: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-purple-500 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">TEAM rate</label>
                    <input
                      type="number"
                      value={policies.rateTeam}
                      onChange={(e) => setPolicies({ ...policies, rateTeam: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Experimental */}
              <div className="p-4 rounded-xl border border-slate-900 bg-purple-950/10 flex items-center justify-between">
                <div>
                  <span className="block font-semibold text-purple-400">Experimental Beta Safety classifications</span>
                  <span className="text-[10px] text-slate-500 leading-relaxed block mt-0.5">Toggle live cognitive perception classification filters</span>
                </div>
                <input
                  type="checkbox"
                  checked={policies.experimentalToggle}
                  onChange={(e) => setPolicies({ ...policies, experimentalToggle: e.target.checked })}
                  className="accent-purple-500 h-4 w-4 rounded border-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wide shadow shadow-purple-500/10 transition"
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span>Enforce active usage policies</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT LOGS MODULE */}
      {activeTab === "logs" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md space-y-5">
            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-900 pb-5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                {/* Search field */}
                <div className="relative max-w-xs flex-1">
                  <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    placeholder="Search logs details..."
                    className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500/80 rounded-xl pl-9 pr-4 py-2.5 text-[10px] text-slate-100 placeholder-slate-650 outline-none transition"
                  />
                </div>

                {/* Filter Activity */}
                <select
                  value={logFilterActivity}
                  onChange={(e) => setLogFilterActivity(e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-200 text-[10px] font-semibold focus:border-purple-500 outline-none transition"
                >
                  <option value="ALL">All Event types</option>
                  <option value="LOGIN">LOGINS</option>
                  <option value="ANALYSIS">ANALYSES</option>
                  <option value="PLAN_UPDATE">PLAN CHANGES</option>
                  <option value="POLICY_UPDATE">POLICY CHANGES</option>
                  <option value="USER_BLOCK">SUSPENSIONS</option>
                  <option value="USER_DELETE">PURGES</option>
                  <option value="VOICE_INPUT">VOICE SCANS</option>
                  <option value="IMAGE_UPLOAD">DOCUMENT SCANS</option>
                </select>

                {/* Filter Status */}
                <select
                  value={logFilterStatus}
                  onChange={(e) => setLogFilterStatus(e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-200 text-[10px] font-semibold focus:border-purple-500 outline-none transition"
                >
                  <option value="ALL">All status codes</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>

              {/* Actions Exporter */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={triggerCsvExport}
                  className="flex items-center justify-center space-x-2 px-3.5 py-2.5 text-xs font-semibold bg-slate-900 border border-slate-850 text-slate-350 hover:text-white rounded-xl transition shadow"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download CSV</span>
                </button>
                
                <button
                  onClick={loadAdministrativePayload}
                  disabled={isLoading}
                  className="p-2.5 rounded-xl border border-slate-850 bg-slate-905 hover:bg-slate-900 text-slate-400 hover:text-white transition"
                  title="Synchronize logs feeds"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Audit stream terminal output */}
            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="h-6 w-6 text-purple-400 animate-spin mx-auto" />
                <span className="text-xs text-slate-500 block">Synchronizing audit streams...</span>
              </div>
            ) : (
              <div className="max-h-[450px] overflow-y-auto space-y-2 border border-slate-900 rounded-xl p-4 bg-slate-950/60 font-mono text-[10px] leading-relaxed divide-y divide-slate-900/60">
                {auditLogs
                  .filter((log) => {
                    const matchesSearch = log.details?.toLowerCase().includes(logSearch.toLowerCase()) || log.activity?.toLowerCase().includes(logSearch.toLowerCase());
                    const matchesActivity = logFilterActivity === "ALL" || log.activity === logFilterActivity;
                    const matchesStatus = logFilterStatus === "ALL" || log.status === logFilterStatus;
                    return matchesSearch && matchesActivity && matchesStatus;
                  })
                  .map((log) => (
                    <div key={log.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 select-all hover:bg-slate-900/10 rounded px-1 transition duration-150">
                      <div className="flex items-start md:items-center space-x-3 min-w-0">
                        <span className="text-slate-500 shrink-0 select-none">
                          [{new Date(log.createdAt).toLocaleTimeString()}]
                        </span>
                        
                        <span
                          className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0 ${
                            log.activity === "LOGIN"
                              ? "bg-indigo-950/40 text-indigo-400 border border-indigo-500/10"
                              : log.activity.includes("BLOCK") || log.activity.includes("DELETE")
                              ? "bg-rose-950/40 text-rose-400 border border-rose-500/10"
                              : "bg-slate-900 border border-slate-800 text-slate-350"
                          }`}
                        >
                          {log.activity}
                        </span>
                        <span className="text-slate-300 truncate" title={log.details}>
                          {log.details}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-slate-500 pl-10 md:pl-0 shrink-0 font-semibold select-none">
                        {log.latencyMs > 0 && <span>Latency: {log.latencyMs}ms</span>}
                        {log.tokensCount > 0 && <span>Tokens: {log.tokensCount}</span>}
                        <span
                          className={`font-extrabold text-[9px] uppercase tracking-wider ${
                            log.status === "SUCCESS" ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Premium Glassmorphic Confirm Modal Overlay */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-900 bg-slate-950/90 backdrop-blur-xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Modal Ambient Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-purple-500/5 blur-2xl pointer-events-none" />
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center">
                <AlertCircle className={`h-4.5 w-4.5 mr-2 shrink-0 ${confirmModal.isDestructive ? "text-rose-500 animate-pulse" : "text-purple-400"}`} />
                {confirmModal.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {confirmModal.message}
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white rounded-xl transition duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                }}
                className={`px-3.5 py-2 text-xs font-semibold text-white rounded-xl transition duration-200 shadow ${
                  confirmModal.isDestructive
                    ? "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-500/10"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/10"
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
