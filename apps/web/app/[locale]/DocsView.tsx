"use client";

import React, { useState } from "react";
import { Card, Badge, Button } from "@perception-mapper/ui";
import {
  FileText,
  Search,
  BookOpen,
  Key,
  Code,
  Terminal,
  ChevronRight,
  Sparkles,
  Clipboard,
  CheckCircle,
} from "lucide-react";

export default function DocsView() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Copy code utility
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const docSections = [
    { id: "getting-started", title: "Getting Started", category: "Basics" },
    { id: "authentication", title: "Authentication", category: "Security" },
    { id: "core-endpoints", title: "Core API Endpoints", category: "Core APIs" },
    { id: "code-examples", title: "Integration Snippets", category: "Code SDKs" },
  ];

  // Filter sections by search query
  const filteredSections = docSections.filter((sec) =>
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic code blocks
  const codeCurl = `curl -X POST http://localhost:3001/api/gateway/analyze \\
  -H "X-API-Key: YOUR_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "This is obviously a biased news article, but the details are confirmable."
  }'`;

  const codeJs = `const requestAnalysis = async () => {
  const response = await fetch("http://localhost:3001/api/gateway/analyze", {
    method: "POST",
    headers: {
      "X-API-Key": "YOUR_API_KEY_HERE",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: "This is obviously a biased news article, but the details are confirmable."
    })
  });
  
  const data = await response.json();
  console.log("Analysis Result:", data);
};`;

  const codePython = `import requests

url = "http://localhost:3001/api/gateway/analyze"
headers = {
    "X-API-Key": "YOUR_API_KEY_HERE",
    "Content-Type": "application/json"
}
payload = {
    "text": "This is obviously a biased news article, but the details are confirmable."
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center">
          <BookOpen className="h-6 w-6 text-indigo-400 mr-2" />
          Developer Documentation
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Explore example request payloads, authentication protocols, and dynamic code sandbox integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Notion-Style Sidebar Navigation */}
        <Card className="lg:col-span-4 p-4 bg-slate-950/40 border-slate-900/60" hoverEffect={false}>
          {/* Search bar */}
          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides..."
              className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500/80 transition-all placeholder-slate-600"
            />
          </div>

          <div className="space-y-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block px-1">Guides & References</span>
            <div className="flex flex-col space-y-1">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl text-left transition ${
                    activeSection === sec.id
                      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ChevronRight className={`h-3 w-3 text-slate-500 transition-transform ${activeSection === sec.id ? "rotate-90 text-indigo-400" : ""}`} />
                    <span>{sec.title}</span>
                  </div>
                  <Badge variant="neutral" className="text-[9px] px-1.5 py-0.5">{sec.category}</Badge>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Right Side: Markdown Content Pane */}
        <Card className="lg:col-span-8 p-6 bg-slate-950/40 border-slate-900/60 font-sans" hoverEffect={false}>
          {/* Active section: Getting Started */}
          {activeSection === "getting-started" && (
            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              <h3 className="text-lg font-bold text-white border-b border-slate-900 pb-3 flex items-center">
                <Sparkles className="h-5 w-5 text-indigo-400 mr-2" />
                Getting Started with Perception API
              </h3>
              <p>
                The **Perception Mapper AI** microservice allows developers to programmatically evaluate text content for cognitive distortions, language localization parameters, and nuanced tone distributions in English, Sinhala, and Tamil.
              </p>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">Quick Integration Steps:</h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-400 mt-2">
                  <li>Generate a developer API Key in the **API Gateway Console**.</li>
                  <li>Incorporate the API Key in the header under <code className="text-indigo-400 bg-slate-950 px-1 py-0.5 rounded border border-slate-900">X-API-Key</code>.</li>
                  <li>Submit analytical payloads using JSON requests to the Gateway router.</li>
                </ol>
              </div>
              <p>
                Developer API requests are evaluated under a standard rate limit window to safeguard infrastructure allocations.
              </p>
            </div>
          )}

          {/* Active section: Authentication */}
          {activeSection === "authentication" && (
            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              <h3 className="text-lg font-bold text-white border-b border-slate-900 pb-3 flex items-center">
                <Key className="h-5 w-5 text-indigo-400 mr-2" />
                Secure API Key Protocols
              </h3>
              <p>
                All external API calls must authorize via the <code className="text-indigo-400 bg-slate-950 px-1 py-0.5 rounded font-mono border border-slate-900">X-API-Key</code> header. Attempts without keys or with invalid keys yield standard authentication rejections:
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs text-red-400">
                {`{
  "statusCode": 401,
  "message": "API Key missing in 'X-API-Key' header",
  "error": "Unauthorized"
}`}
              </div>
              <p>
                Keep API Keys private. Generating a new key will instantly invalidate previous credentials.
              </p>
            </div>
          )}

          {/* Active section: Core Endpoints */}
          {activeSection === "core-endpoints" && (
            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              <h3 className="text-lg font-bold text-white border-b border-slate-900 pb-3 flex items-center">
                <FileText className="h-5 w-5 text-indigo-400 mr-2" />
                Core Analysis Gateway Routing
              </h3>
              <div>
                <span className="inline-flex bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase mr-2">POST</span>
                <code className="text-white font-mono text-xs">/api/gateway/analyze</code>
              </div>
              <p className="text-xs text-slate-400">
                Evaluates input query parameters using live tokenizers and sidecar processes. Returns sentiment averages, objectivity scores, tone metrics, and cognitive distortions.
              </p>
              
              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Payload Parameters:</h4>
                <div className="text-xs space-y-2 font-mono">
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-indigo-300 font-bold">text</span>
                    <span className="text-slate-500">string (Required) - text block to scan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-300 font-bold">language</span>
                    <span className="text-slate-500">string (Optional) - auto, en, ta, si</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active section: Code Examples */}
          {activeSection === "code-examples" && (
            <div className="space-y-6 text-sm text-slate-300">
              <h3 className="text-lg font-bold text-white border-b border-slate-900 pb-3 flex items-center">
                <Code className="h-5 w-5 text-indigo-400 mr-2" />
                Multi-Language Integration Snippets
              </h3>

              {/* cURL Block */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-slate-950 px-4 py-2 rounded-t-xl border-x border-t border-slate-900">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center">
                    <Terminal className="h-3.5 w-3.5 text-indigo-400 mr-1.5" />
                    cURL CLI Sandbox
                  </span>
                  <button
                    onClick={() => copyToClipboard(codeCurl, "curl")}
                    className="text-slate-500 hover:text-slate-300 transition flex items-center space-x-1"
                  >
                    {copiedKey === "curl" ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
                    <span className="text-[10px]">{copiedKey === "curl" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 p-4 rounded-b-xl border-x border-b border-slate-900 text-[10.5px] text-slate-300 overflow-x-auto whitespace-pre font-mono leading-relaxed select-all">
                  {codeCurl}
                </pre>
              </div>

              {/* Node.js Block */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-slate-950 px-4 py-2 rounded-t-xl border-x border-t border-slate-900">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center">
                    <Code className="h-3.5 w-3.5 text-indigo-400 mr-1.5" />
                    JavaScript (Fetch API)
                  </span>
                  <button
                    onClick={() => copyToClipboard(codeJs, "js")}
                    className="text-slate-500 hover:text-slate-300 transition flex items-center space-x-1"
                  >
                    {copiedKey === "js" ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
                    <span className="text-[10px]">{copiedKey === "js" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 p-4 rounded-b-xl border-x border-b border-slate-900 text-[10.5px] text-slate-300 overflow-x-auto whitespace-pre font-mono leading-relaxed select-all">
                  {codeJs}
                </pre>
              </div>

              {/* Python Block */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-slate-950 px-4 py-2 rounded-t-xl border-x border-t border-slate-900">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center">
                    <Code className="h-3.5 w-3.5 text-indigo-400 mr-1.5" />
                    Python (Requests SDK)
                  </span>
                  <button
                    onClick={() => copyToClipboard(codePython, "py")}
                    className="text-slate-500 hover:text-slate-300 transition flex items-center space-x-1"
                  >
                    {copiedKey === "py" ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
                    <span className="text-[10px]">{copiedKey === "py" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 p-4 rounded-b-xl border-x border-b border-slate-900 text-[10.5px] text-slate-300 overflow-x-auto whitespace-pre font-mono leading-relaxed select-all">
                  {codePython}
                </pre>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
