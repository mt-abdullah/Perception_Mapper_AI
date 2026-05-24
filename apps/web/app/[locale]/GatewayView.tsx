"use client";

import React, { useState } from "react";
import { Card, Badge, Button, Textarea } from "@perception-mapper/ui";
import {
  Key,
  Shield,
  Send,
  RefreshCw,
  Clipboard,
  CheckCircle,
  Activity,
  Layers,
} from "lucide-react";

export default function GatewayView() {
  const [apiKeyName, setApiKeyName] = useState("");
  const [apiKeys, setApiKeys] = useState<any[]>([
    { name: "Default Production Token", key: "pm_key_team_pro_2026", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString() }
  ]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sandbox states
  const [sandboxText, setSandboxText] = useState("We are clearly observing a massive and catastrophic structural failure here.");
  const [sandboxKey, setSandboxKey] = useState("pm_key_team_pro_2026");
  const [sandboxResponse, setSandboxResponse] = useState<any>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<any>({
    limit: 5,
    remaining: 5,
    resetTime: new Date(Date.now() + 60000).toLocaleTimeString()
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateKey = async () => {
    if (!apiKeyName.trim()) return;
    try {
      const res = await fetch("http://localhost:3001/api/gateway/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: apiKeyName })
      });
      if (res.ok) {
        const result = await res.json();
        setApiKeys((prev) => [
          ...prev,
          { name: result.name, key: result.key, createdAt: new Date(result.createdAt).toLocaleDateString() }
        ]);
        setApiKeyName("");
      }
    } catch (e) {
      // Mock fallback creation if offline
      const mockKey = "pm_key_mock_" + Math.random().toString(36).substr(2, 8);
      setApiKeys((prev) => [
        ...prev,
        { name: apiKeyName, key: mockKey, createdAt: new Date().toLocaleDateString() }
      ]);
      setApiKeyName("");
    }
  };

  const handleSendSandboxRequest = async () => {
    setSandboxLoading(true);
    setSandboxResponse(null);
    try {
      const res = await fetch("http://localhost:3001/api/gateway/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": sandboxKey
        },
        body: JSON.stringify({ text: sandboxText })
      });

      const result = await res.json();
      setSandboxResponse(result);

      if (res.ok) {
        // Track analytics trigger on successful scan
        await fetch("http://localhost:3001/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activity: "ANALYSIS", details: "Developer Gateway API Sandbox Request" })
        }).catch(() => {});

        if (result.rateLimit) {
          setRateLimitInfo({
            limit: result.rateLimit.limit,
            remaining: result.rateLimit.remaining,
            resetTime: new Date(result.rateLimit.resetTime).toLocaleTimeString()
          });
        }
      } else {
        if (res.status === 429) {
          setRateLimitInfo((prev: any) => ({ ...prev, remaining: 0 }));
        }
      }
    } catch (e) {
      console.error(e);
      setSandboxResponse({
        success: false,
        error: "Gateway Connection Error",
        message: "Failed to establish a network channel to the API Gateway on port 3001."
      });
    } finally {
      setSandboxLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center">
          <Shield className="h-6 w-6 text-indigo-400 mr-2" />
          API Gateway Console
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Generate API access keys, inspect Redis sliding rate limiters, and interact directly with active endpoint gateways.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Keys Generator & Rate Limits */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* API Key Provisioning Card */}
          <Card className="p-6 bg-slate-950/40 border-slate-900/60" hoverEffect={false}>
            <h3 className="text-sm font-bold tracking-wider text-indigo-400 uppercase flex items-center mb-4">
              <Key className="h-4 w-4 mr-2" />
              API Token Provisioner
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Token Name Label</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={apiKeyName}
                    onChange={(e) => setApiKeyName(e.target.value)}
                    placeholder="e.g. CLI Production automation"
                    className="flex-1 bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  />
                  <Button onClick={handleCreateKey} variant="primary" className="text-xs py-2 px-4 shrink-0">
                    Generate Key
                  </Button>
                </div>
              </div>

              {/* Keys list */}
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-900/60">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Generated Access Keys</span>
                {apiKeys.map((keyObj: any) => (
                  <div key={keyObj.key} className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between font-mono text-[11px]">
                    <div className="min-w-0 pr-2">
                      <span className="text-white block font-sans font-bold text-xs truncate">{keyObj.name}</span>
                      <span className="text-indigo-400 block truncate font-mono text-[10px] mt-1 select-all">{keyObj.key}</span>
                      <span className="text-[9px] text-slate-600 block mt-0.5 font-sans">Created {keyObj.createdAt}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(keyObj.key)}
                      className="text-slate-500 hover:text-slate-300 shrink-0 p-1 bg-slate-900 border border-slate-800 rounded-lg"
                    >
                      {copiedKey === keyObj.key ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Clipboard className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Rate Limiter Widget Card */}
          <Card className="p-6 bg-slate-950/40 border-slate-900/60" hoverEffect={false}>
            <h3 className="text-sm font-bold tracking-wider text-indigo-400 uppercase flex items-center mb-4">
              <Activity className="h-4 w-4 mr-2" />
              Redis Sliding Rate Limiter
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Active Window Remaining Quota:</span>
                <span className="font-extrabold text-white font-mono">{rateLimitInfo.remaining} / {rateLimitInfo.limit} requests</span>
              </div>

              {/* Progress gauge bar */}
              <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-900 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    rateLimitInfo.remaining === 0
                      ? "bg-red-500"
                      : rateLimitInfo.remaining < 3
                      ? "bg-amber-500"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500"
                  }`}
                  style={{ width: `${(rateLimitInfo.remaining / rateLimitInfo.limit) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-[10px] mt-2 pt-2 border-t border-slate-900">
                <div>
                  <span className="text-slate-500 block uppercase font-bold tracking-wider">Sliding Window Reset</span>
                  <span className="text-indigo-400 block font-mono font-bold mt-0.5">{rateLimitInfo.resetTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-bold tracking-wider">Status Code</span>
                  <span className={`block font-bold mt-0.5 uppercase ${rateLimitInfo.remaining === 0 ? "text-red-500 animate-pulse" : "text-emerald-400"}`}>
                    {rateLimitInfo.remaining === 0 ? "429 Limited" : "200 Active"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Interactive Developer Sandbox Playground */}
        <Card className="lg:col-span-7 p-6 bg-slate-950/40 border-slate-900/60 flex flex-col" hoverEffect={false}>
          <div className="mb-4">
            <h3 className="text-sm font-bold tracking-wider text-indigo-400 uppercase flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              API Sandbox Playground
            </h3>
            <p className="text-[11px] text-slate-500">Run manual analysis requests directly through the gateway microservice</p>
          </div>

          <div className="space-y-4 flex-1 flex flex-col">
            {/* API Key header sandbox input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Authorization X-API-Key</label>
              <input
                type="text"
                value={sandboxKey}
                onChange={(e) => setSandboxKey(e.target.value)}
                placeholder="Enter pm_key_..."
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-indigo-300 font-mono outline-none focus:border-indigo-500"
              />
            </div>

            {/* Payloads sandbox text input */}
            <div className="flex-1 flex flex-col">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">JSON Payload Text Block</label>
              <Textarea
                value={sandboxText}
                onChange={(e) => setSandboxText(e.target.value)}
                placeholder="Type custom text snippet here..."
                className="flex-1 min-h-[140px] text-xs p-3 text-slate-200 border-slate-900 focus:ring-indigo-500/40"
              />
            </div>

            {/* Send Request Action Button */}
            <Button
              onClick={handleSendSandboxRequest}
              disabled={sandboxLoading || !sandboxText.trim() || !sandboxKey.trim()}
              variant="primary"
              className="py-3 shadow-lg flex items-center justify-center space-x-2"
            >
              {sandboxLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-1.5" />
                  <span>Routing Gateway Payload...</span>
                </>
              ) : (
                <>
                  <span>Send API Gateway Request</span>
                  <Send className="h-3.5 w-3.5 ml-1" />
                </>
              )}
            </Button>

            {/* Sandbox Response Output Console */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-900/60 flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">API Gateway Response Payload</span>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 min-h-[150px] max-h-[250px] overflow-y-auto font-mono text-[10.5px] leading-relaxed text-emerald-400 select-all scrollbar-thin">
                {sandboxResponse ? (
                  <pre className="whitespace-pre-wrap">{JSON.stringify(sandboxResponse, null, 2)}</pre>
                ) : (
                  <span className="text-slate-600 block text-center mt-12 font-sans text-xs">Console idle. Send a sandbox query to analyze payloads.</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
