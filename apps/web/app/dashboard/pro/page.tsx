"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useDashboard } from "../../../hooks/useDashboard";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import Preloader from "../../../components/Preloader";
import EnterpriseDashboard from "../../../components/dashboard/EnterpriseDashboard";
import BatchProcessor from "../../../components/dashboard/BatchProcessor";
import BiasNetworkGraph from "../../../components/dashboard/BiasNetworkGraph";
import SentimentMetricsDashboard from "../../../components/dashboard/SentimentMetricsDashboard";
import PromptSandbox from "../../../components/dashboard/PromptSandbox";

export default function ProDashboardPage() {
  const router = useRouter();
  const { isSignedIn, user, mounted } = useAuth();
  const db = useDashboard();

  useEffect(() => {
    if (mounted && !isSignedIn) router.replace("/sign-in");
  }, [mounted, isSignedIn, router]);

  if (!mounted || !isSignedIn || !user) return <Preloader message="CONNECTING PERCEPTION PRO PORTAL..." />;

  return (
    <DashboardLayout theme="pro" activePage="pro">
      <div className="space-y-8 select-none text-left">
        <EnterpriseDashboard db={db} />
        <BatchProcessor />
        <BiasNetworkGraph />
        <SentimentMetricsDashboard />
        <PromptSandbox />
      </div>
    </DashboardLayout>
  );
}
