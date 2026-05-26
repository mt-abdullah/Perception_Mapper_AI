import React from "react";

export default function Footer() {
  return (
    <footer className="w-full glass-panel border-t border-slate-900/60 py-6 text-center text-[10px] text-slate-650 relative select-none">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="font-medium text-slate-500">
          © 2026 PERCEPTION AI SaaS Platform. All orbital node logs encrypted via SSL handshakes.
        </span>
        <div className="flex space-x-6 font-semibold text-slate-450">
          <a href="#workspace" className="hover:text-slate-200 transition">
            Assistant Workbench
          </a>
          <a href="#telemetry" className="hover:text-slate-200 transition">
            SSE Monitor
          </a>
        </div>
      </div>
    </footer>
  );
}
