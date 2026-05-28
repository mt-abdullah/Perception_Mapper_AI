"use client";

import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { User, Upload, Check } from "lucide-react";

export default function AvatarSelector() {
  const { user, updateAvatar } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const presets = [
    "https://api.dicebear.com/7.x/bottts/svg?seed=neutral",
    "https://api.dicebear.com/7.x/bottts/svg?seed=apex",
    "https://api.dicebear.com/7.x/bottts/svg?seed=cypher",
    "https://api.dicebear.com/7.x/bottts/svg?seed=titan"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string" && updateAvatar) {
        updateAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 relative select-none font-sans overflow-hidden">
      <div className="flex items-center space-x-2 border-b border-slate-900 pb-3 mb-6">
        <User className="h-4 w-4 text-indigo-400" />
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Avatar Workspace Profile</h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-20 h-20 rounded-full border border-indigo-500/30 overflow-hidden bg-slate-900 flex items-center justify-center cursor-pointer shrink-0"
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-slate-500" />
          )}

          {isHovered && (
            <label className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center cursor-pointer text-[8px] font-bold text-indigo-400 uppercase">
              <Upload className="h-4 w-4 mb-0.5" />
              <span>Upload</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          )}
        </div>

        <div className="space-y-3.5 text-left w-full">
          <div>
            <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-widest mb-1.5">Preset Avatars</span>
            <div className="flex items-center gap-3">
              {presets.map((p, idx) => {
                const isActive = user?.avatarUrl === p;
                return (
                  <button
                    key={idx}
                    onClick={() => updateAvatar && updateAvatar(p)}
                    className={`relative w-11 h-11 rounded-lg border bg-slate-955/60 overflow-hidden flex items-center justify-center transition hover:border-slate-800 ${
                      isActive ? "border-indigo-500" : "border-slate-900/60"
                    }`}
                  >
                    <img src={p} alt={`Preset ${idx}`} className="w-9 h-9" />
                    {isActive && (
                      <span className="absolute bottom-0.5 right-0.5 bg-indigo-500 rounded-full p-0.5">
                        <Check className="h-2 w-2 text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
