import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full glass-panel border-t border-slate-900/60 py-6 text-center text-[10px] text-slate-650 relative select-none">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="font-medium text-slate-500">
          © 2026 PERCEPTION AI SaaS Platform. All orbital node logs encrypted via SSL handshakes.
        </span>
        <div className="flex space-x-6 font-semibold text-slate-400">
          <Link href="/contact" className="hover:text-slate-200 transition">
            Contact Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
