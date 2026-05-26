// apps/web/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../clerk-compat";
import { useRouter, usePathname } from "next/navigation";
import { Button, Card, Textarea, Badge } from "@perception-mapper/ui";
import {
  Sparkles,
  Mic,
  Globe,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Download,
  Key,
  Users,
  Sliders,
  Cpu,
  Layers,
  Terminal,
  Play,
  FileText,
  Volume2,
  CheckCircle,
  HelpCircle,
  Copy,
  Zap,
  Lock,
  Compass,
  Layout,
  Code,
  DollarSign,
  Maximize2,
  Minimize2,
  Eye,
  Trash2,
  Settings,
  ShieldCheck,
  Radio,
  FileCheck,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { speakText, toggleListening } from "../voice-helper";

export default function DashboardPage() {
  const { isSignedIn, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Protect route – unauthenticated users are sent to /login
  useEffect(() => {
    if (!isSignedIn) {
      router.replace("/login");
    }
  }, [isSignedIn]);

  // Re‑use the UI from the previous workspace page (PerceptionWorkspace)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [mockSignedIn, setMockSignedIn] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<"USER" | "ADMIN" | "DEVELOPER">("USER");
  const [userProfile, setUserProfile] = useState({
    name: "Astraea Vance",
    email: "astraea@perception.ai",
    avatar: "https://ui-avatars.com/api/?name=Astraea+Vance&background=4f46e5&color=fff",
    tier: "Enterprise Tier",
  });

  // Sync mock state with real auth (for development)
  useEffect(() => {
    if (mounted) setMockSignedIn(isSignedIn);
  }, [mounted, isSignedIn]);

  useEffect(() => {
    if (mounted && user) {
      setUserProfile({
        name: user.name || "Astraea Vance",
        email: user.email || "astraea@perception.ai",
        avatar: user.avatarUrl || "https://ui-avatars.com/api/?name=Astraea+Vance",
        tier: user.role === "ADMIN" ? "Platform Admin" : user.role === "DEVELOPER" ? "System Developer" : "Standard User",
      });
    }
  }, [mounted, user]);

  // The rest of the UI (omitted for brevity) can be copied from the original workspace
  // For this implementation we simply render a placeholder indicating the dashboard is loaded.
  return (
    <section className="min-h-screen bg-slate-955 text-white p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-2">Welcome, {userProfile.name}!</p>
      <p className="mb-4">Your role: {userProfile.tier}</p>
      {/* Insert the full PerceptionWorkspace UI here if needed */}
    </section>
  );
}
