"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/clerk-compat";
import Navbar from "@/components/Navbar";
import useConfiguration from "@/hooks/useConfiguration";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export default function ConfigurationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, user } = useAuth();
  const { settings, loading, error, updateSettings } = useConfiguration();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isSignedIn) {
      const locale = pathname.split('/')[1] || 'en';
      router.push(`/${locale}/sign-in`);
    }
  }, [isSignedIn, router, pathname]);

  // Local state handling similar to ConfigurationPanel
  const [localSettings, setLocalSettings] = React.useState<any>({});

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleChange = (section: string, field: string, value: any) => {
    setLocalSettings((prev: any) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  const handleSave = async () => {
    await updateSettings(localSettings);
  };

  if (!isSignedIn) {
    return null; // Redirecting
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/90 backdrop-blur-md rounded-xl p-6 glass"
        >
          <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error loading settings</p>}

          {/* System Settings */}
          <section className="mb-6">
            <h3 className="text-lg font-medium mb-2">System Settings</h3>
            <label className="flex items-center space-x-2 mb-2">
              <span>Dark Mode</span>
              <input
                type="checkbox"
                checked={localSettings?.system?.theme === "dark"}
                onChange={e =>
                  handleChange("system", "theme", e.target.checked ? "dark" : "light")
                }
              />
            </label>
            <label className="flex items-center space-x-2 mb-2">
              <span>Language</span>
              <select
                value={localSettings?.system?.language || "EN"}
                onChange={e => handleChange("system", "language", e.target.value)}
                className="bg-slate-800 text-slate-200 p-1 rounded"
              >
                <option value="EN">English</option>
                <option value="TA">தமிழ்</option>
                <option value="SI">සිංහල</option>
              </select>
            </label>
            <label className="flex items-center space-x-2 mb-2">
              <span>UI Animations</span>
              <input
                type="checkbox"
                checked={localSettings?.system?.uiAnimations}
                onChange={e => handleChange("system", "uiAnimations", e.target.checked)}
              />
            </label>
          </section>

          {/* AI Engine Settings */}
          <section className="mb-6">
            <h3 className="text-lg font-medium mb-2">AI Engine Settings</h3>
            {[{ label: "Tone Analysis", field: "toneAnalysis" },
              { label: "Bias Detection", field: "biasDetection" },
              { label: "Voice Input", field: "voiceInput" },
              { label: "Image Analysis", field: "imageAnalysis" }].map(item => (
              <label key={item.field} className="flex items-center space-x-2 mb-2">
                <span>{item.label}</span>
                <input
                  type="checkbox"
                  checked={localSettings?.ai?.[item.field]}
                  onChange={e => handleChange("ai", item.field, e.target.checked)}
                />
              </label>
            ))}
          </section>

          {/* User Preferences */}
          <section className="mb-6">
            <h3 className="text-lg font-medium mb-2">User Preferences</h3>
            <label className="flex items-center space-x-2 mb-2">
              <span>Default Dashboard</span>
              <input
                type="text"
                value={localSettings?.user?.defaultDashboard || ""}
                onChange={e => handleChange("user", "defaultDashboard", e.target.value)}
                className="bg-slate-800 text-slate-200 p-1 rounded"
              />
            </label>
            <label className="flex items-center space-x-2 mb-2">
              <span>Notifications</span>
              <input
                type="checkbox"
                checked={localSettings?.user?.notifications}
                onChange={e => handleChange("user", "notifications", e.target.checked)}
              />
            </label>
            <label className="flex items-center space-x-2 mb-2">
              <span>Auto‑Logout (minutes)</span>
              <input
                type="number"
                min={0}
                value={localSettings?.user?.autoLogoutMinutes || 0}
                onChange={e =>
                  handleChange("user", "autoLogoutMinutes", Number(e.target.value))
                }
                className="w-20 bg-slate-800 text-slate-200 p-1 rounded"
              />
            </label>
          </section>

          {/* Admin Configuration – only for admins */}
          {user?.role === "ADMIN" && (
            <section className="mb-6">
              <h3 className="text-lg font-medium mb-2">Admin Configuration</h3>
              <label className="flex items-center space-x-2 mb-2">
                <span>API Rate Limit</span>
                <input
                  type="number"
                  min={0}
                  value={localSettings?.admin?.rateLimit || 0}
                  onChange={e =>
                    handleChange("admin", "rateLimit", Number(e.target.value))
                  }
                  className="w-20 bg-slate-800 text-slate-200 p-1 rounded"
                />
              </label>
              <label className="flex items-center space-x-2 mb-2">
                <span>Enable Signup</span>
                <input
                  type="checkbox"
                  checked={localSettings?.admin?.signupEnabled}
                  onChange={e => handleChange("admin", "signupEnabled", e.target.checked)}
                />
              </label>
              <label className="flex items-center space-x-2 mb-2">
                <span>Maintenance Mode</span>
                <input
                  type="checkbox"
                  checked={localSettings?.admin?.maintenanceMode}
                  onChange={e => handleChange("admin", "maintenanceMode", e.target.checked)}
                />
              </label>
            </section>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition disabled:opacity-50 flex items-center"
            >
              {loading && <RefreshCw className="h-4 w-4 mr-1 animate-spin" />}
              Save
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
